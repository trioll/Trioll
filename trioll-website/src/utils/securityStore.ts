// Simple store for sharing security state across components
type Subscriber = (value: boolean) => void;

class SecurityStore {
  private securityBreached: boolean = false;
  private subscribers: Subscriber[] = [];

  getSecurityBreached(): boolean {
    return this.securityBreached;
  }

  setSecurityBreached(value: boolean): void {
    this.securityBreached = value;
    // Notify all subscribers
    this.subscribers.forEach(subscriber => subscriber(value));
  }

  subscribe(callback: Subscriber): () => void {
    this.subscribers.push(callback);
    // Return unsubscribe function
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback);
    };
  }
}

// Create singleton instance
const securityStore = new SecurityStore();
export default securityStore;
