
const Objectives = () => {
    return (
    <div>
        <div className="text-3xl text-[#461711] font-bold color-[#461711] w-full">
          Our Objectives
        </div>

        <div className="mt-10 flex flex-col md:flex-row justify-between gap-5">
          <div className="flex   gap-6 ">
            <img src="/obj1.png" alt="obj1" width={160} />
            <div>
              <div className="text-xl text-[#461711] font-semibold">
                Self Awareness through
              </div>
              <ul className="list-disc">
                <li>Webinars</li>
                <li>Mental Health Workshops</li>
                <li>Offline Events</li>
              </ul>
            </div>
          </div>

          <div className="flex gap-6">
            <img src="/obj2.png" alt="obj2" width={160} />
            <div>
              <div className="text-xl text-[#461711] font-semibold">
                Self Expression through
              </div>
              <ul className="list-disc">
                <li>Events for showcasing skills</li>
                <li>Volunteering for Community Initiatives</li>
                <li>Support Groups</li>
              </ul>
            </div>
          </div>

          <div className="flex gap-6">
            <img src="/obj3.png" alt="obj3" width={160} />
            <div>
              <div className="text-xl text-[#461711] font-semibold">
                Self Sufficiency through
              </div>
              <ul className="list-disc">
                <li>Technical Workshops</li>
                <li>Creative Workshops</li>
                <li>Soft Skills Workshops</li>
              </ul>
            </div>
          </div>
        </div>
    </div>
    );
};

export default Objectives;