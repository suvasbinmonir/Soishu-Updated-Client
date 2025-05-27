import { Link } from 'react-router-dom';
import { termsSections } from '../../Data/terms';
import { privacySections } from '../../Data/privecy';

export const Privacy = () => {
  return (
    <main className="lg:py-40 py-12 max-w-[1440px] mx-auto lg:px-10 px-5 min-h-[calc(100vh-80px)]">
      <div>
        <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-800">
          Privacy & Policy
        </h1>
      </div>

      <div>
        <div className="flex items-center text-gray-500 mt-2 md:text-lg">
          <Link
            to="/"
            className="flex items-center hover:text-[#713601] transition-colors"
          >
            Home
          </Link>
          <span className="mx-2">&gt;</span>
          <span>Privacy & Policy</span>
        </div>
      </div>

      <div>
        <hr className="mt-5 lg:mb-16 mb-12 border border-gray-300" />
      </div>

      {privacySections.map((section, idx) => (
        <div key={idx}>
          <section className="mb-8">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">
              {section.heading}
            </h2>
            {section.paragraphs?.map((p, i) => (
              <p key={i} className="text-gray-700 mb-4 text-justify md:text-lg">
                {p}
              </p>
            ))}
            {section.listItems && (
              <ul className="list-disc pl-4 space-y-3 text-base text-gray-700 mb-4">
                {section.listItems.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            )}
            {section.closing && (
              <p className="text-gray-700 mb-4 text-justify md:text-lg">
                {section.closing}
              </p>
            )}
          </section>
        </div>
      ))}
    </main>
  );
};
