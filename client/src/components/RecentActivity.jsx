function RecentActivity({ notes }) {
  function getTextPreview(htmlContent) {
    if (!htmlContent) {
      return "No content available.";
    }

    const temporaryElement = document.createElement("div");
    temporaryElement.innerHTML = htmlContent;

    // Remove media and embedded elements from the preview
    temporaryElement
      .querySelectorAll("img, iframe, video, audio, object, embed, svg")
      .forEach((element) => element.remove());

    const plainText = temporaryElement.textContent
      .replace(/\s+/g, " ")
      .trim();

    if (!plainText) {
      return "Rich media note";
    }

    return plainText.length > 110
      ? `${plainText.slice(0, 110)}...`
      : plainText;
  }

  const recentNotes = notes
    .slice()
    .sort(
      (a, b) =>
        new Date(b.createdAt) - new Date(a.createdAt)
    )
    .slice(0, 5);

  return (
    <div className="panel activity-panel">
      <div className="panel-heading">
        <div>
          <h2>Recent Activity</h2>
          <p>Your latest workspace updates.</p>
        </div>
      </div>

      {recentNotes.length === 0 ? (
        <div className="empty-activity">
          <div className="empty-icon">◌</div>

          <h3>No activity yet</h3>

          <p>
            Your notes, files, and tasks will appear here.
          </p>
        </div>
      ) : (
        <div className="activity-list">
          {recentNotes.map((note) => (
            <div
              className="activity-item"
              key={note._id}
            >
              <div className="activity-icon">📝</div>

              <div className="activity-details">
                <h3>
                  {note.title || "Untitled Note"}
                </h3>

                <p className="recent-activity-content">
                  {getTextPreview(note.content)}
                </p>

                <small>
                  {new Date(
                    note.createdAt
                  ).toLocaleString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </small>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RecentActivity;