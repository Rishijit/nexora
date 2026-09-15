function NotebookAnimation() {
  return (
    <div className="notebook-animation" aria-hidden="true">
      <div className="notebook-cover">
        <div className="notebook-binding">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>

        <div className="notebook-pages">
          <div className="notebook-page page-one">
            <div className="page-lines">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>

          <div className="notebook-page page-two">
            <div className="page-lines">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>

          <div className="notebook-page page-three">
            <div className="page-lines">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>

          <div className="notebook-page page-four">
            <div className="page-lines">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>

        <div className="notebook-title">NEXORA</div>
        <div className="notebook-small-text">IDEAS · NOTES · PROGRESS</div>
      </div>
    </div>
  );
}

export default NotebookAnimation;