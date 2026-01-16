import {
  ArrowRight,
  ArrowsClockwise,
  CheckCircle,
  GithubLogo,
  LinkedinLogo,
  ListChecks,
  ShieldCheck,
  Sparkle,
} from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <header className="glass sticky top-0 z-50 border-border/50 border-b">
        <nav className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link
            className="flex items-center gap-2 transition-transform duration-200 hover:scale-105"
            href="/"
          >
            <div className="gradient-primary flex h-9 w-9 items-center justify-center rounded-lg">
              <ListChecks className="h-5 w-5 text-white" weight="bold" />
            </div>
            <span className="font-bold text-xl">Taskit</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button>
                Get Started
                <ArrowRight className="h-4 w-4" weight="bold" />
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24 text-center">
        <div className="mx-auto max-w-4xl animate-fade-in">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-accent px-4 py-1.5 text-accent-foreground text-sm">
            <Sparkle className="h-4 w-4" weight="fill" />
            AI-Powered Task Management
          </div>

          <h1 className="mb-6 font-bold text-5xl tracking-tight sm:text-6xl lg:text-7xl">
            Organize your work,
            <span className="block bg-gradient-to-r from-white to-primary bg-clip-text text-transparent">
              accomplish more
            </span>
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Taskit helps you manage tasks, organize projects, and boost
            productivity with a beautiful, intuitive interface. Perfect for
            individuals and small teams.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/register">
              <Button
                className="min-w-50 text-primary outline-primary hover:bg-white/10!"
                size="lg"
                variant={"outline"}
              >
                Start for Free
                <ArrowRight className="h-5 w-5" weight="bold" />
              </Button>
            </Link>
            <Link href="/login">
              <Button className="min-w-50" size="lg">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-24">
        <div className="mb-16 text-center">
          <h2 className="mb-4 font-bold text-3xl sm:text-4xl">
            Everything you need to stay organized
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground/80">
            Powerful features designed to help you manage your work efficiently.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              className="group rounded-2xl border border-border bg-card p-8 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl"
              key={feature.title}
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-accent-foreground transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground">
                {feature.icon}
              </div>
              <h3 className="mb-2 font-semibold text-xl">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-24">
        <div className="gradient-primary overflow-hidden rounded-3xl p-12 text-center text-white shadow-2xl">
          <h2 className="mb-4 font-bold text-3xl sm:text-4xl">
            Ready to boost your productivity?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-white/80">
            Join thousands of users who are already managing their tasks more
            effectively with Taskit.
          </p>
          <Link href="/register">
            <Button
              className="bg-white text-background hover:bg-white/90"
              size="lg"
              variant="secondary"
            >
              Get Started for Free
              <ArrowRight className="h-5 w-5" weight="bold" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-border border-t py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="gradient-primary flex h-8 w-8 items-center justify-center rounded-lg">
                <ListChecks className="h-4 w-4 text-white" weight="bold" />
              </div>
              <span className="font-semibold">Taskit</span>
            </div>

            <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-4">
              <p className="text-muted-foreground text-sm">
                Made with ❤️ by{" "}
                <span className="font-medium text-foreground">
                  Tushar Kumar
                </span>
              </p>
              <div className="flex items-center gap-3">
                <a
                  className="text-muted-foreground transition-all duration-200 hover:scale-110 hover:text-primary"
                  href="https://linkedin.com/in/your-profile"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <LinkedinLogo className="h-5 w-5" weight="fill" />
                </a>
                <a
                  className="text-muted-foreground transition-all duration-200 hover:scale-110 hover:text-primary"
                  href="https://github.com/your-username"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <GithubLogo className="h-5 w-5" weight="fill" />
                </a>
              </div>
            </div>

            <p className="text-muted-foreground text-sm">
              © {new Date().getFullYear()} Taskit. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    title: "Task Management",
    description:
      "Create, organize, and track tasks with priorities, due dates, and status updates.",
    icon: <CheckCircle className="h-6 w-6" weight="fill" />,
  },
  {
    title: "Project Organization",
    description:
      "Group related tasks into projects with custom colors for easy identification.",
    icon: <ListChecks className="h-6 w-6" weight="fill" />,
  },
  {
    title: "Smart Prioritization",
    description:
      "Set priorities from low to urgent to focus on what matters most.",
    icon: <Sparkle className="h-6 w-6" weight="fill" />,
  },
  {
    title: "Secure & Private",
    description:
      "Your data is encrypted and secure. Only you can access your tasks.",
    icon: <ShieldCheck className="h-6 w-6" weight="fill" />,
  },
  {
    title: "Real-time Updates",
    description:
      "Changes sync instantly across all your devices for seamless workflow.",
    icon: <ArrowsClockwise className="h-6 w-6" weight="fill" />,
  },
  {
    title: "AI-Powered Insights",
    description:
      "Get smart suggestions and insights to optimize your productivity.",
    icon: <Sparkle className="h-6 w-6" weight="fill" />,
  },
];
