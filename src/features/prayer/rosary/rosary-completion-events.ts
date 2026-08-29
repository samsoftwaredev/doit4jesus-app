type RosaryCompletionListener = () => void;

const listeners = new Set<RosaryCompletionListener>();

export function notifyRosaryCompletionRecorded() {
  listeners.forEach((listener) => listener());
}

export function subscribeToRosaryCompletion(listener: RosaryCompletionListener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
