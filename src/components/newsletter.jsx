import { PhotoProvider, PhotoView } from "react-photo-view";

const Newsletter = () => {
    return (
        <div className="px-4 md:px-28 flex flex-col md:flex-row mt-10 justify-center gap-10 md:gap-20">
        <div>
          <div className="text-3xl font-semibold text-[#461711] mt-10">
            Stay Informed with Our Newsletter
          </div>
          <div>
            <p className="mt-10 mb-2">
              Subscribe to receive updates and lates news on mail.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Email"
                className="border-2 border-[#461711] rounded-md p-2 focus:ring-2 focus:ring-[#ff7612] focus:border-transparent outline-none"
              />
              <button
                className="rounded-md border-2 text-white font-bold bg-[#461711] p-2 hover:bg-[#ff7612] transition-colors duration-300"
              >
                Subscribe
              </button>
            </div>
          </div>
          <img src="/newsletter-gh.png" alt="" className="w-80" />
          <div>
            <PhotoProvider>
              <div className="italic mb-2">Our previous newsletters</div>
              <div className="flex gap-4">
              <PhotoView src="/NL/NLOct2024.jpg">
                  <img src="/NL/NLOct2024.jpg" alt="" width={100} />
                </PhotoView>
                <PhotoView src="/NL/NLSept2024.jpeg">
                  <img src="/NL/NLSept2024.jpeg" alt="" width={100} />
                </PhotoView>
                <PhotoView src="/NL/NLAugust2024.jpeg">
                  <img src="/NL/NLAugust2024.jpeg" alt="" width={100} />
                </PhotoView>
                <PhotoView src="/NL/NLJuly2024.jpeg">
                  <img src="/NL/NLJuly2024.jpeg" alt="" width={100} />
                </PhotoView>
                <PhotoView src="/NL/NLJune2024.jpg">
                  <img src="/NL/NLJune2024.jpg" alt="" width={100} />
                </PhotoView>
                <PhotoView src="/NL/NLMay2024.jpg">
                  <img src="/NL/NLMay2024.jpg" alt="" width={100} />
                </PhotoView>
              </div>
            </PhotoProvider>
          </div>
        </div>
        <div className="w-100">
          <PhotoProvider>
            <PhotoView src="/NL/NLnov2024.jpg">
              <img src="/NL/NLnov2024.jpg" alt="" width={600} />
            </PhotoView>
          </PhotoProvider>
        </div>
      </div>
       );
    };

export default Newsletter;