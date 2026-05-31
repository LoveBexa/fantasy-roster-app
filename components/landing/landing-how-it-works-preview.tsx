import Image from "next/image"
import { landingHowItWorks } from "@/lib/landing/landing-content"

export function LandingHowItWorksPreview() {
  return (
    <section
      aria-label="How it works preview"
      className="border-t border-border/60 bg-[#F9F4EB] py-14 pb-10 lg:py-20 lg:pb-12"
    >
      <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-3 lg:gap-8">
        {landingHowItWorks.steps.map((step) => (
          <article key={step.number} className="relative">
            <div className="flex items-start gap-3">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                {step.number}
              </span>
              <h3 className="pt-1 font-serif text-xl font-bold text-foreground">{step.title}</h3>
            </div>

            {"players" in step && step.players ? (
              <ul className="mt-6 space-y-3 rounded-2xl border border-border/60 bg-background/60 p-5">
                {step.players.map((player) => (
                  <li
                    key={player.name}
                    className="flex items-center gap-3 text-sm font-medium text-foreground"
                  >
                    <span className="text-xl">{player.emoji}</span>
                    {player.name}
                  </li>
                ))}
              </ul>
            ) : null}

            {"behaviors" in step && step.behaviors ? (
              <div className="relative mt-6">
                <div className="grid grid-cols-2 gap-4 rounded-2xl border border-border/60 bg-background/60 p-5">
                  {step.behaviors.map((behavior) => (
                    <div key={behavior.label} className="flex flex-col items-center gap-2 text-center">
                      <span className="text-3xl">{behavior.emoji}</span>
                      <span className="text-[0.65rem] font-bold uppercase tracking-wide text-primary">
                        {behavior.label}
                      </span>
                    </div>
                  ))}
                </div>
                {"annotation" in step && step.annotation ? (
                  <p className="absolute -bottom-8 right-2 font-script text-2xl text-primary">
                    {step.annotation} ↓
                  </p>
                ) : null}
              </div>
            ) : null}

            {"standings" in step && step.standings ? (
              <div className="mt-6 overflow-hidden rounded-2xl border border-border/60 bg-background/60">
                <table className="w-full text-left text-xs">
                  <tbody>
                    {step.standings.map((row) => (
                      <tr key={row.name} className="border-b border-border/50 last:border-0">
                        <td className="px-4 py-3 font-serif text-lg font-bold">{row.rank}</td>
                        <td className="px-2 py-3">
                          <span className="flex items-center gap-2 font-medium">
                            {row.emoji} {row.name}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right font-serif font-bold text-primary">
                          <span className="inline-flex items-center gap-2">
                            {row.points}
                            {row.isMvp ? (
                              <Image
                                src="/images/trophy.png"
                                alt=""
                                width={20}
                                height={20}
                                className="size-5 object-contain"
                              />
                            ) : null}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  )
}
