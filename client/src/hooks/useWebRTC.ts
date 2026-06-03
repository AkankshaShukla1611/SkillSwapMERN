'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import { useSocket } from '@/contexts/SocketContext';

const ICE = [{ urls: 'stun:stun.l.google.com:19302' }];

export type CallStatus = 'idle' | 'calling' | 'incoming' | 'in-call' | 'ended';

export function useWebRTC(selfId: string | undefined, peerId: string | undefined) {
  const { socket } = useSocket();
  const [status, setStatus] = useState<CallStatus>('idle');
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [muted, setMuted] = useState(false);
  const [camOff, setCamOff] = useState(false);
  const pc = useRef<RTCPeerConnection | null>(null);
  const pending = useRef<RTCIceCandidateInit[]>([]);
  const offerBuf = useRef<RTCSessionDescriptionInit | null>(null);

  const cleanup = useCallback(() => {
    pc.current?.close();
    pc.current = null;
    localStream?.getTracks().forEach((t) => t.stop());
    setLocalStream(null);
    setRemoteStream(null);
    pending.current = [];
    offerBuf.current = null;
  }, [localStream]);

  const newPC = useCallback((stream: MediaStream) => {
    const p = new RTCPeerConnection({ iceServers: ICE });
    stream.getTracks().forEach((t) => p.addTrack(t, stream));
    const remote = new MediaStream();
    setRemoteStream(remote);
    p.ontrack = (e) => e.streams[0]?.getTracks().forEach((t) => remote.addTrack(t));
    p.onicecandidate = (e) => e.candidate && socket?.emit('call:ice', { to: peerId, candidate: e.candidate.toJSON() });
    p.onconnectionstatechange = () => {
      if (p.connectionState === 'connected') setStatus('in-call');
      else if (['failed', 'closed', 'disconnected'].includes(p.connectionState)) setStatus('ended');
    };
    pc.current = p;
    return p;
  }, [socket, peerId]);

  useEffect(() => {
    if (!socket || !selfId) return;
    const onInvite = ({ from }: any) => { if (peerId && from === peerId) setStatus('incoming'); };
    const onOffer = async ({ from, sdp }: any) => {
      if (peerId && from !== peerId) return;
      offerBuf.current = sdp;
    };
    const onAnswer = async ({ sdp }: any) => {
      if (!pc.current) return;
      await pc.current.setRemoteDescription(new RTCSessionDescription(sdp));
      for (const c of pending.current) await pc.current.addIceCandidate(new RTCIceCandidate(c));
      pending.current = [];
    };
    const onIce = async ({ candidate }: any) => {
      if (pc.current?.remoteDescription) await pc.current.addIceCandidate(new RTCIceCandidate(candidate));
      else pending.current.push(candidate);
    };
    const onEnd = () => { cleanup(); setStatus('ended'); };

    socket.on('call:invite', onInvite);
    socket.on('call:offer', onOffer);
    socket.on('call:answer', onAnswer);
    socket.on('call:ice', onIce);
    socket.on('call:end', onEnd);
    return () => {
      socket.off('call:invite', onInvite); socket.off('call:offer', onOffer);
      socket.off('call:answer', onAnswer); socket.off('call:ice', onIce); socket.off('call:end', onEnd);
    };
  }, [socket, selfId, peerId, cleanup]);

  const start = useCallback(async (video = true) => {
    if (!socket || !peerId) return;
    setStatus('calling');
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video });
    setLocalStream(stream);
    const p = newPC(stream);
    socket.emit('call:invite', { to: peerId });
    const offer = await p.createOffer();
    await p.setLocalDescription(offer);
    socket.emit('call:offer', { to: peerId, sdp: offer });
  }, [socket, peerId, newPC]);

  const accept = useCallback(async (video = true) => {
    if (!socket || !peerId) return;
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video });
    setLocalStream(stream);
    const p = newPC(stream);
    const wait = async () => {
      for (let i = 0; i < 50; i++) { if (offerBuf.current) return offerBuf.current; await new Promise((r) => setTimeout(r, 100)); }
      return null;
    };
    const offer = offerBuf.current || (await wait());
    if (!offer) return;
    await p.setRemoteDescription(new RTCSessionDescription(offer));
    const ans = await p.createAnswer();
    await p.setLocalDescription(ans);
    socket.emit('call:answer', { to: peerId, sdp: ans });
    for (const c of pending.current) await p.addIceCandidate(new RTCIceCandidate(c));
    pending.current = [];
  }, [socket, peerId, newPC]);

  const end = useCallback(() => {
    socket?.emit('call:end', { to: peerId });
    cleanup();
    setStatus('idle');
  }, [socket, peerId, cleanup]);

  const toggleMute = () => { localStream?.getAudioTracks().forEach((t) => (t.enabled = muted)); setMuted(!muted); };
  const toggleCam = () => { localStream?.getVideoTracks().forEach((t) => (t.enabled = camOff)); setCamOff(!camOff); };

  return { status, localStream, remoteStream, muted, camOff, start, accept, end, toggleMute, toggleCam };
}
