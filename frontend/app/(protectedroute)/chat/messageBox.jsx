import './messagebox.css';

export default function MessageBox({ message, isCurrentUser }) {
  return (
    <div
      className={`message-box ${
        isCurrentUser ? "current-user" : ""
      }`}
    >
      <div className="message-content">
        {message.image && (
          <img
            src={message.image}
            alt="Shared image"
          />
        )}

        {message.text && (
          <div>{message.text}</div>
        )}
      </div>
    </div>
  );
}