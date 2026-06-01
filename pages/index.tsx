import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-background p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          Next.js + Tailwind + shadcn/ui + Framer Motion
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Your project is ready to go.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="flex gap-4"
      >
        <Button>Get Started</Button>
        <Button variant="outline">Learn More</Button>
        <Button variant="ghost">Docs</Button>
      </motion.div>
    </main>
  )
}
