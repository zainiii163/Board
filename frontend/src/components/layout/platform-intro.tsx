"use client";

export function PlatformIntro() {
  return (
    <section className="border-t border-border bg-gradient-to-b from-background via-accent/[0.02] to-background">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          {/* Main Heading */}
          <div className="mb-10 text-center">
            <h2 className="font-serif text-2xl font-black text-foreground sm:text-3xl lg:text-4xl">
              Your Complete Learning & Exam Preparation Platform
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">
              Designed specifically for students from Class 5 to Class 12, BoardNotes provides comprehensive academic resources to help you excel in your studies and prepare confidently for your board examinations. Our platform brings together everything you need to succeed in one convenient location.
            </p>
          </div>

          {/* Feature Sections */}
          <div className="space-y-10">
            {/* Study Resources */}
            <div className="rounded-2xl border border-border bg-card/50 p-6 sm:p-8">
              <div className="mb-4 flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-accent">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                  </svg>
                </span>
                <h3 className="font-serif text-xl font-bold text-foreground sm:text-2xl">
                  Study Resources for Every Class
                </h3>
              </div>
              <p className="text-base leading-relaxed text-muted sm:text-lg">
                Access high-quality Books & Notes tailored to your specific class and subject requirements. Whether you're in Class 5, Class 10, or preparing for your Class 12 board exams, our curated study materials are organized by grade level and subject to help you find exactly what you need for effective learning and revision.
              </p>
            </div>

            {/* Exam Preparation */}
            <div className="rounded-2xl border border-border bg-card/50 p-6 sm:p-8">
              <div className="mb-4 flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-accent">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M9 12h6" />
                    <path d="M12 9v6" />
                    <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
                  </svg>
                </span>
                <h3 className="font-serif text-xl font-bold text-foreground sm:text-2xl">
                  Prepare Smarter for Board Exams
                </h3>
              </div>
              <p className="text-base leading-relaxed text-muted sm:text-lg">
                Understanding exam patterns is crucial for success. Our Pairing Schemes, Past Papers, and Guess Papers provide valuable insights into what to expect in your board examinations. These resources help you identify important topics, understand question formats, and practice with actual exam papers from previous years, giving you a significant advantage in your preparation.
              </p>
            </div>

            {/* Practice & Testing */}
            <div className="rounded-2xl border border-border bg-card/50 p-6 sm:p-8">
              <div className="mb-4 flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-accent">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                    <path d="M14 2v6h6" />
                    <path d="M8 13h8" />
                    <path d="M8 17h8" />
                    <path d="M8 9h2" />
                  </svg>
                </span>
                <h3 className="font-serif text-xl font-bold text-foreground sm:text-2xl">
                  Practice & Test Yourself
                </h3>
              </div>
              <p className="text-base leading-relaxed text-muted sm:text-lg">
                Put your knowledge to the test with our innovative Test Generator feature. Create custom practice tests based on your specific subjects and chapters, allowing you to assess your understanding, identify areas that need improvement, and build confidence before your actual exams. Regular practice with our testing tools helps reinforce learning and improves retention.
              </p>
            </div>

            {/* Expert Support */}
            <div className="rounded-2xl border border-border bg-card/50 p-6 sm:p-8">
              <div className="mb-4 flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-accent">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </span>
                <h3 className="font-serif text-xl font-bold text-foreground sm:text-2xl">
                  Learn with Expert Support
                </h3>
              </div>
              <p className="text-base leading-relaxed text-muted sm:text-lg">
                Sometimes you need extra help to master difficult concepts. Our Tuitions section connects you with experienced tutors and additional learning resources when you need them most. Whether you're struggling with a specific topic or want to deepen your understanding, our tuition services provide the personalized support you need to overcome challenges and achieve your academic goals.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
