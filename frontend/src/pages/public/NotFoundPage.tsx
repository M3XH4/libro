import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LibroLogo } from '../../components/brand/LibroLogo'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { pageTransition, pageVariants } from '../../components/ui/motion'

export function NotFoundPage() {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
      className="mx-auto flex min-h-screen max-w-6xl items-center px-4 py-8 lg:px-6"
    >
      <Card className="mx-auto w-full max-w-lg">
        <CardHeader>
          <LibroLogo subtitle="Library Management System" />
          <CardTitle className="mt-4">Page not found</CardTitle>
          <CardDescription>
            This Libro page does not exist or has moved.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 sm:flex-row">
          <Button asChild>
            <Link to="/">Go home</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link to="/login">Sign in</Link>
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  )
}
