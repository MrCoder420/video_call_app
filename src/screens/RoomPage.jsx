import { useCallback, useEffect, useRef, useState } from "react";
import { useSocket } from "../context/SocketProvider.jsx";
import peer from "../service/PeerService.jsx";

const RoomPage = () => {
  const socket = useSocket();
  const [myStream, setMyStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const myVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const handleUserJoined = useCallback(({ email, id }) => {
    console.log("✅ User joined:", id);
    setRemoteSocketId(id);
  }, []);

  const handleCallUser = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    setMyStream(stream);

    const offer = await peer.getOffer();
    socket.emit("callUser", { to: remoteSocketId, offer });
  }, [remoteSocketId, socket]);

  const handleIncomingCall = useCallback(async ({ from, offer }) => {
    setRemoteSocketId(from);
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    setMyStream(stream);

    const answer = await peer.getAnswer(offer);
    socket.emit("callaccepted", { to: from, answer });
  }, [socket]);

  const handleCallAccepted = useCallback(async ({ answer }) => {
    if (peer.peer.signalingState === "have-local-offer") {
      await peer.setRemoteAnswer(answer);
    } else {
      console.warn("handleCallAccepted: Not setting remote answer, signaling state:", peer.peer.signalingState);
    }
  }, []);

  const handleNegotiationNeeded = useCallback(async () => {
    const offer = await peer.getOffer();
    socket.emit("peer:nego:needed", { offer, to: remoteSocketId });
  }, [socket, remoteSocketId]);

  const handleNegotiationNeededIncoming = useCallback(async ({ offer, to }) => {
    const answer = await peer.getAnswer(offer);
    socket.emit("peer:nego:done", { answer, to });
  }, [socket]);

  const handleNegotiationFinal = useCallback(async ({ answer }) => {
    if (peer.peer.signalingState === "have-local-offer") {
      await peer.setRemoteAnswer(answer);
    } else if (peer.peer.signalingState === "stable") {
      // Already stable, no need to set remote answer
      console.info("handleNegotiationFinal: Peer connection already stable, skipping setRemoteAnswer.");
    } else {
      console.warn("handleNegotiationFinal: Not setting remote answer, signaling state:", peer.peer.signalingState);
    }
  }, []);

  useEffect(() => {
    peer.onNegotiationNeeded((offer) => {
      socket.emit("peer:nego:needed", { offer, to: remoteSocketId });
    });

    peer.onTrack((stream) => {
      console.log("🎥 Remote stream received:", stream);
      setRemoteStream(stream);
    });
  }, [remoteSocketId, socket]);

  useEffect(() => {
    socket.on("userjoined", handleUserJoined);
    socket.on("incomingCall", handleIncomingCall);
    socket.on("callaccepted", handleCallAccepted);
    socket.on("peer:nego:needed", handleNegotiationNeededIncoming);
    socket.on("peer:nego:final", handleNegotiationFinal);

    return () => {
      socket.off("userjoined", handleUserJoined);
      socket.off("incomingCall", handleIncomingCall);
      socket.off("callaccepted", handleCallAccepted);
      socket.off("peer:nego:needed", handleNegotiationNeededIncoming);
      socket.off("peer:nego:final", handleNegotiationFinal);
    };
  }, [socket]);

  useEffect(() => {
    if (myVideoRef.current && myStream) {
      myVideoRef.current.srcObject = myStream;
    }
  }, [myStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  // Add this effect to add tracks only once when myStream is set
  useEffect(() => {
    if (myStream) {
      // Prevent adding tracks multiple times
      myStream.getTracks().forEach(track => {
        // Only add if not already added
        if (!peer.peer.getSenders().find(sender => sender.track === track)) {
          peer.addTrack(track, myStream);
        }
      });
    }
  }, [myStream]);

  return (
    <div>
      <h1>Room</h1>
      <p>{remoteSocketId ? "✅ User Connected" : "⏳ Waiting for user..."}</p>

      {remoteSocketId && (
        <button onClick={handleCallUser}>📞 Call</button>
      )}

      {myStream && (
        <div>
          <h3>📷 My Camera</h3>
          <video
            ref={myVideoRef}
            autoPlay
            playsInline
            muted
            style={{ width: "100%", maxWidth: "400px", border: "2px solid black" }}
          />
        </div>
      )}

      {remoteStream && (
        <div>
          <h3>📡 Remote Camera</h3>
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            style={{ width: "100%", maxWidth: "400px", border: "2px solid red" }}
          />
        </div>
      )}
    </div>
  );
};

export default RoomPage;
