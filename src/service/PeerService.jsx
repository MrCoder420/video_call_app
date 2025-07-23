class PeerService {
  constructor() {
    this.peer = new RTCPeerConnection({
      iceServers: [
        {
          urls: [
            "stun:stun.l.google.com:19302",
            "stun:global.stun.twilio.com:3478",
          ],
        },
      ],
    });
    this.isNegotiating = false;
    this._registerNegotiationHandler();

    // Listen for signaling state changes to reset negotiation flag
    this.peer.onsignalingstatechange = () => {
      // Only reset if stable
      if (this.peer.signalingState === "stable") {
        this.isNegotiating = false;
      }
    };
  }

  _registerNegotiationHandler() {
    this.peer.onnegotiationneeded = async () => {
      // Only negotiate if not already negotiating and signaling state is stable
      if (this.isNegotiating || this.peer.signalingState !== "stable") return;
      this.isNegotiating = true;
      try {
        const offer = await this.getOffer();
        this.onNegotiationNeededCallback?.(offer);
      } catch (err) {
        console.error("Negotiation failed:", err);
      } finally {
        // isNegotiating will be reset by onsignalingstatechange when stable
      }
    };
  }

  onNegotiationNeeded(callback) {
    this.onNegotiationNeededCallback = callback;
  }

  async getOffer() {
    const offer = await this.peer.createOffer();
    await this.peer.setLocalDescription(offer);
    return offer;
  }

  async getAnswer(offer) {
    await this.peer.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await this.peer.createAnswer();
    await this.peer.setLocalDescription(answer);
    return answer;
  }

  async setRemoteAnswer(answer) {
    // Only set remote answer if in correct signaling state
    if (this.peer.signalingState === "have-local-offer") {
      await this.peer.setRemoteDescription(new RTCSessionDescription(answer));
    } else {
      console.warn("setRemoteAnswer called in wrong signaling state:", this.peer.signalingState);
    }
  }

  addTrack(track, stream) {
    this.peer.addTrack(track, stream);
  }

  onTrack(callback) {
    this.peer.ontrack = ({ streams }) => {
      callback(streams[0]);
    };
  }

  onIceCandidate(callback) {
    this.peer.onicecandidate = (event) => {
      if (event.candidate) {
        callback(event.candidate);
      }
    };
  }

  addIceCandidate(candidate) {
    this.peer.addIceCandidate(new RTCIceCandidate(candidate));
  }
}

export default new PeerService();
