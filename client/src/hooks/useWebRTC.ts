'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import { useSocket } from '@/contexts/SocketContext';

const ICE = [{ urls: 'stun:stun.l.google.com:19302' }];

export type CallStatus = 'idle' | 'calling' | 'incoming' | 'in-call' | 'ended';

export function useWebRTC(selfId: string | undefined, peerId: string | undefined) {
  console.log('================');
  console.log('WEBRTC INIT');
  console.log('SELF ID:', selfId);
  console.log('PEER ID:', peerId);
  console.log('================');
  const { socket } = useSocket();
  const [status, setStatus] = useState<CallStatus>('idle');
  const [isVideoCall, setIsVideoCall] = useState(false);
  const incomingVideo = useRef(false);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [muted, setMuted] = useState(false);
  const [camOff, setCamOff] = useState(false);
  const pc = useRef<RTCPeerConnection | null>(null);
  const pending = useRef<RTCIceCandidateInit[]>([]);
  const offerBuf = useRef<RTCSessionDescriptionInit | null>(null);

  const cleanup = useCallback(() => {
    console.log('CLEANUP CALLED');

    pc.current?.close();
    pc.current = null;

    localStream?.getTracks().forEach((t) => {
      console.log('STOPPING TRACK:', t.kind);
      t.stop();
    });

    setLocalStream(null);
    setRemoteStream(null);
    setIsVideoCall(false);

    pending.current = [];
    offerBuf.current = null;
  }, [localStream]);

  const newPC = useCallback((stream: MediaStream) => {
    const p = new RTCPeerConnection({ iceServers: ICE });
    stream.getTracks().forEach((t) => p.addTrack(t, stream));
    const remote = new MediaStream();
    setRemoteStream(remote);

    p.ontrack = (e) => {
    console.log("========== REMOTE TRACK ==========");
    console.log("Streams:", e.streams);

    console.log(
      "Audio Tracks:",
      e.streams[0].getAudioTracks()
    );

    console.log(
      "Video Tracks:",
      e.streams[0].getVideoTracks()
    );

    e.streams[0].getTracks().forEach((track) => {
      remote.addTrack(track);
      console.log(
        "TRACK",
        track.kind,
        track.enabled,
        track.muted,
        track.readyState
        );
    });
  };
    p.onicecandidate = (e) => e.candidate && socket?.emit('call:ice', { to: peerId, candidate: e.candidate.toJSON() });
    p.onconnectionstatechange = async () => {

      console.log("STATE =", p.connectionState);

      if (p.connectionState === "connected") {

          const receivers = p.getReceivers();

          console.log("RECEIVERS");

          receivers.forEach(r => {

              console.log(
                  r.track?.kind,
                  r.track?.enabled,
                  r.track?.muted,
                  r.track?.readyState
              );

          });

      }

    };
    pc.current = p;
    return p;
  }, [socket, peerId]);

  useEffect(() => {
    if (!socket || !selfId || !peerId) return;
    const onInvite = ({ from, video }: any) => {
      console.log("RECEIVED INVITE", from, video, peerId);

       if (peerId && from !== peerId) {
        console.log("IGNORING INVITE");
        return;
      }

      console.log("SETTING STATUS TO INCOMING");

      incomingVideo.current = !!video;
      setIsVideoCall(!!video);
      setStatus("incoming");
    };
    const onOffer = async ({ from, sdp }: any) => {
      console.log("RECEIVED OFFER", from);

      if (peerId && from !== peerId) return;

      offerBuf.current = sdp;
    };

    const onAnswer = async ({ sdp }: any) => {
      console.log("RECEIVED ANSWER");

      if (!pc.current) return;

      await pc.current.setRemoteDescription(
        new RTCSessionDescription(sdp)
      );
      setStatus("in-call");

      for (const c of pending.current) {
        await pc.current.addIceCandidate(new RTCIceCandidate(c));
      }

      pending.current = [];
    };
    const onIce = async ({ candidate }: any) => {
      console.log("RECEIVED ICE");

      if (pc.current?.remoteDescription) {
        await pc.current.addIceCandidate(
          new RTCIceCandidate(candidate)
        );
      } else {
        pending.current.push(candidate);
      }
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

  console.log("START FUNCTION CALLED");
  console.log("VIDEO =", video);

  if (!socket || !peerId) {
    console.log("START RETURNED");
    console.log("SOCKET =", socket);
    console.log("PEER =", peerId);
    return;
  }


  setStatus('calling');
  setIsVideoCall(video);

  let stream: MediaStream;

  try {
    console.log("Incoming video:", incomingVideo.current);
    stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
      video
    });
  } catch (err) {
    console.error('GET USER MEDIA FAILED', err);
    return;
  }

  setLocalStream(stream);

  const p = newPC(stream);

  console.log("EMITTING CALL INVITE");
  console.log("TO:", peerId);
  console.log("VIDEO:", video);

  console.log("EMITTING INVITE");
  console.log({
    to: peerId,
    video,
  });

  socket.emit("call:invite", {
    to: peerId,
    video,
  });

  console.log("INVITE EMITTED");

  console.log("CALL INVITE EMITTED");
  console.log("Starting call. Video =", video);

  const offer = await p.createOffer();

  await p.setLocalDescription(offer);

  socket.emit('call:offer', {
    to: peerId,
    sdp: offer,
  });
}, [socket, peerId, newPC]);

  const accept = useCallback(async () => {

    console.log("ACCEPT CLICKED");

    console.log("navigator =", navigator);
    console.log("getUserMedia =", navigator.mediaDevices?.getUserMedia);
    console.log("navigator.mediaDevices =", navigator.mediaDevices);
    console.log("window.isSecureContext =", window.isSecureContext);

    const video = incomingVideo.current;
    if (!socket || !peerId) return;
    let stream: MediaStream;

    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
        video,
      });
    } catch (err: any) {

      console.error("GET USER MEDIA FAILED", err);

      if (err.name === "NotReadableError") {
        alert(
          "Camera is already in use by another browser window or application.\n\nClose the other camera or test using two different devices."
        );
      }

      return;
    }

    setLocalStream(stream);
    const p = newPC(stream);
    const wait = async () => {
      for (let i = 0; i < 50; i++) { if (offerBuf.current) return offerBuf.current; await new Promise((r) => setTimeout(r, 100)); }
      return null;
    };
    const offer = offerBuf.current || (await wait());
    console.log("OFFER =", offer);
    if (!offer) {
      console.log("Offer not received yet");
      return;
    }
    await p.setRemoteDescription(new RTCSessionDescription(offer));
    const ans = await p.createAnswer();
    await p.setLocalDescription(ans);
    setStatus("in-call");
    socket.emit('call:answer', { to: peerId, sdp: ans });
    for (const c of pending.current) await p.addIceCandidate(new RTCIceCandidate(c));
    pending.current = [];
  }, [socket, peerId, newPC]);

  const end = useCallback(() => {
    console.log('CALL ENDED');

    socket?.emit('call:end', { to: peerId });

    cleanup();

    setStatus('idle');
  }, [socket, peerId, cleanup]);

  const toggleMute = () => { localStream?.getAudioTracks().forEach((t) => (t.enabled = muted)); setMuted(!muted); };
  const toggleCam = () => { localStream?.getVideoTracks().forEach((t) => (t.enabled = camOff)); setCamOff(!camOff); };

  return { status, isVideoCall, localStream, remoteStream, muted, camOff, start, accept, end, toggleMute, toggleCam };
}
