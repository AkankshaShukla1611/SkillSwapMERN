'use client';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { useSocket } from '@/contexts/SocketContext';
import { useWebRTC } from '@/hooks/useWebRTC';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Phone, Video, Mic, MicOff, VideoOff, PhoneOff } from 'lucide-react';

export default function ChatRoomPage() {
  const { id } = useParams<{ id: string }>();
  const { user, loading } = useAuth();
  console.log('AUTH USER:', user);
  // console.log('AUTH USER ID:', user?.id);
  console.log('AUTH USER _ID:', user?._id);
  const { socket, online } = useSocket();
  const [convo, setConvo] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState('');
  const [peerTyping, setPeerTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const other = convo?.participants?.find((p: any) => p._id !== user?._id);
  console.log('CURRENT USER:', user);
  console.log('OTHER USER:', other);
  console.log('CURRENT USER _id:', user?._id);
  console.log('OTHER USER _id:', other?._id);
  const readyForCall = !!user?._id && !!other?._id;
  const rtc = useWebRTC(
    readyForCall ? user._id : undefined,
    readyForCall ? other._id : undefined
  );
  
  const localVideo = useRef<HTMLVideoElement>(null);
  const remoteVideo = useRef<HTMLVideoElement>(null);
  const remoteAudio = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (!id) return;
    api.get(`/api/conversations`).then((r) => setConvo(r.data.find((c: any) => c._id === id)));
    api.get(`/api/conversations/${id}/messages`).then((r) => setMessages(r.data));
    api.patch(`/api/conversations/${id}/read`).catch(() => {});
  }, [id]);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  useEffect(() => {
    if (!socket) return;
    const onNew = (m: any) => { if (m.conversation === id) setMessages((p) => [...p, m]); if (m.receiver === user?._id) api.patch(`/api/conversations/${id}/read`).catch(() => {}); };
    const onTyping = (p: any) => { if (p.conversationId === id) setPeerTyping(!!p.isTyping); };
    socket.on('chat:new', onNew);
    socket.on('chat:typing', onTyping);
    return () => { socket.off('chat:new', onNew); socket.off('chat:typing', onTyping); };
  }, [socket, id, user]);

  useEffect(() => {
    if (localVideo.current && rtc.localStream) {
      localVideo.current.srcObject = rtc.localStream;
      localVideo.current.muted = true;

      localVideo.current.play().catch(() => {});
    }

    if (rtc.isVideoCall) {
      if (remoteVideo.current && rtc.remoteStream) {
        remoteVideo.current.srcObject = rtc.remoteStream;
        remoteVideo.current.muted = false;
        remoteVideo.current.volume = 1;

        remoteVideo.current.play().catch(console.error);
      }
    } else {
      if (remoteAudio.current && rtc.remoteStream) {
        remoteAudio.current.srcObject = rtc.remoteStream;
        remoteAudio.current.volume = 1;
        remoteAudio.current.muted = false;

        remoteAudio.current.play().catch(console.error);
      }
    }
  }, [
    rtc.localStream,
    rtc.remoteStream,
    rtc.isVideoCall
  ]);
  const send = async () => {
    const body = text.trim(); if (!body) return;
    setText('');
    await api.post(`/api/conversations/${id}/messages`, { content: body });
  };

  const typingTimer = useRef<any>();
  const onType = (v: string) => {
    setText(v);
    socket?.emit('chat:typing', { conversationId: id, to: other?._id, isTyping: true });
    clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => socket?.emit('chat:typing', { conversationId: id, to: other?._id, isTyping: false }), 1200);
  };


    if (loading) {
      return (
        <div className="p-12 text-center">
          Loading...
        </div>
      );
    }

    if (!user) {
      return (
        <div className="p-12 text-center">
          Sign in.
        </div>
      );
    }  

  return (
    <div className="container mx-auto px-4 py-6 max-w-3xl flex flex-col h-[calc(100vh-4rem)]">
      <Card className="flex justify-between items-center mb-3">
        <div>
          <p className="font-semibold">{other?.name || '…'}</p>
          <p className="text-xs text-muted-foreground">{other && online.has(other._id) ? 'Online' : 'Offline'}{peerTyping && ' • typing…'}</p>
        </div>
        <div className="flex gap-2">
          {rtc.status === 'idle' || rtc.status === 'ended' ? (
            <>
              <Button size="icon" variant="outline" disabled={!readyForCall} onClick={() => rtc.start(false)}><Phone className="h-4 w-4" /></Button>
              <Button size="icon" disabled={!readyForCall} onClick={() => rtc.start(true)}><Video className="h-4 w-4" /></Button>
            </>
          ) : rtc.status === 'incoming' ? (
            <>
                <Button
                  size="sm"
                  onClick={rtc.accept}
              >
                  Accept
              </Button>
              <Button size="sm" variant="destructive" onClick={rtc.end}>Decline</Button>
            </>
          ) : (
            <>
              <Button size="icon" variant="outline" onClick={rtc.toggleMute}>{rtc.muted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}</Button>
              <Button size="icon" variant="outline" onClick={rtc.toggleCam}>{rtc.camOff ? <VideoOff className="h-4 w-4" /> : <Video className="h-4 w-4" />}</Button>
              <Button size="icon" variant="destructive" onClick={rtc.end}><PhoneOff className="h-4 w-4" /></Button>
            </>
          )}
        </div>
      </Card>

      <audio ref={remoteAudio} autoPlay/>

      {rtc.isVideoCall && rtc.status !== 'idle' &&rtc.status !== 'ended' &&(
        <div className="relative bg-black rounded-xl overflow-hidden mb-3 aspect-video">
          <video ref={remoteVideo} autoPlay playsInline controls={false} muted={false} className="w-full h-full object-cover" />
          <video ref={localVideo} autoPlay playsInline muted className="absolute bottom-2 right-2 w-32 h-24 rounded-md border border-white/20 object-cover" />
        </div>
      )}

      <div className="flex-1 overflow-y-auto space-y-2 py-2">
        {messages.map((m) => {
          const mine = m.sender === user._id;
          return (
            <div key={m._id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm ${mine ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                {m.content}
                {mine && <span className="block text-[10px] opacity-70 mt-0.5">{m.read ? 'Read' : 'Sent'}</span>}
              </div>
            </div>
          );
        })}
        <div ref={endRef} />
      </div>

      <div className="flex gap-2 pt-2 border-t border-border">
        <Input value={text} onChange={(e) => onType(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && send()} placeholder="Type a message…" />
        <Button onClick={send}>Send</Button>
      </div>
    </div>
  );
}
