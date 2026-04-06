// AboutOpening.tsx — Zone 1
// Full-width centered statement — type-led, no image, generous whitespace

const NAVBAR_H = 68;
const SECTION_MIN_H = `calc(100vh - ${NAVBAR_H}px)`;


const Opening = () => {
    return (
        <section
            className="relative z-10 px-5 sm:px-8 flex flex-col items-center justify-center text-center"
            style={{ minHeight: SECTION_MIN_H, background: "var(--background)" }}
        >
            <div className="max-w-5xl mx-auto">

                {/* Eyebrow */}
                <p
                    className="text-[11px] font-bold tracking-[0.22em] uppercase mb-10"
                    style={{ color: "var(--brand)" }}
                >
                    About Plurse
                </p>

                {/* Main statement — the most important line on the page */}
                <h1
                    className="font-bold tracking-[-0.035em] leading-[1.06]"
                    style={{
                        fontSize: "clamp(2.6rem, 7vw, 5.5rem)",
                        color: "var(--foreground)",
                        fontFamily: "var(--font-geist-sans)",
                    }}
                >
                    Building the operating
                    <br className="hidden sm:block" />
                    system for{" "}
                    <span style={{ color: "var(--brand)" }}>African business.</span>
                </h1>

                {/* Breathing room — a single clean line */}
                <div
                    className="mx-auto mt-14 mb-14"
                    style={{
                        width: "40px",
                        height: "1px",
                        background: "var(--border-strong)",
                    }}
                />

                {/* Quiet subline */}
                <p
                    className="mx-auto"
                    style={{
                        fontSize: "clamp(15px, 2vw, 18px)",
                        lineHeight: "1.8",
                        color: "var(--text-muted)",
                        maxWidth: "580px",
                    }}
                >
                    Africa has more than 40 million small and medium businesses.
                    Most of them run on memory, paper and instinct.
                    <br className="hidden sm:block" />
                    Plurse exists to change that — one business at a time.
                </p>
            </div>
        </section>
    );
}

export default Opening;