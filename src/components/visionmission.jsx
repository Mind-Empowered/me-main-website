
const VisionMission = () => {
    return (
        <div className="mission-vision-container">
          <div className="mission-vision-card">
            <div className="flex flex-col items-center gap-6">
              <img src="/vision.png" alt="vision" className="w-48 h-48 object-contain" />
              <div>
                <h2 className="text-4xl font-bold italic color-[#461711] mb-4">Our Vision</h2>
                <p className="text-xl">
                  Empowering{" "}
                  <span className="inline-highlight-1">Individuals</span>{" "}
                  to navigate life with{" "}
                  <span className="inline-highlight-1">Emotional Resilience</span>.
                </p>
              </div>
            </div>
          </div>
          
          <div className="mission-vision-card">
            <div className="flex flex-col items-center gap-6">
              <img src="/mission.png" alt="mission" className="w-48 h-48 object-contain" />
              <div>
                <h2 className="text-4xl font-bold italic color-[#461711] mb-4">
                  Our Mission
                </h2>
                <p className="text-xl">
                  Championing the cause of mental health through{" "}
                  <span className="inline-highlight-1">Awareness</span>,{" "}
                  <span className="inline-highlight-1">Education</span>,{" "}
                  <span className="inline-highlight-1">Advocacy</span> and Creating
                  an empathetic community.
                </p>
              </div>
            </div>
          </div>
        </div>
    );
};

export default VisionMission;