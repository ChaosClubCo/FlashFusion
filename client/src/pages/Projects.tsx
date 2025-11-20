import { Helmet } from 'react-helmet-async';
import { DashboardBackground } from '@/components/DashboardBackground';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FolderOpen, Search, Plus, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';

export default function Projects() {
  return (
    <>
      <Helmet>
        <title>Projects - FlashFusion</title>
        <meta name="description" content="Manage all your AI-generated projects" />
      </Helmet>

      <DashboardBackground />

      <div className="min-h-screen px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div>
              <h1 className="text-4xl font-bold mb-2" data-testid="heading-projects">
                <span className="bg-gradient-to-r from-[#00C2FF] to-[#6F51FF] bg-clip-text text-transparent">
                  My Projects
                </span>
              </h1>
              <p className="text-foreground/70">Manage your AI-generated applications</p>
            </div>

            <Link href="/workflows">
              <Button className="bg-[#00C2FF] text-white" data-testid="button-new-project">
                <Plus className="w-4 h-4 mr-2" />
                New Project
              </Button>
            </Link>
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            className="mb-8 flex flex-col md:flex-row gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search projects..." 
                className="pl-10 bg-card/40 backdrop-blur-md border-border/50"
                data-testid="input-search"
              />
            </div>
            <Button variant="outline" className="bg-card/40 backdrop-blur-md" data-testid="button-filters">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </motion.div>

          {/* Empty State */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="bg-card/40 backdrop-blur-md border-border/50" data-testid="card-empty-state">
              <CardHeader>
                <CardTitle className="text-foreground">No Projects Yet</CardTitle>
                <CardDescription className="text-foreground/60">Start creating AI-powered applications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-16">
                  <FolderOpen className="w-20 h-20 mx-auto mb-6 text-muted-foreground/50" />
                  <h3 className="text-2xl font-semibold text-foreground mb-3">Your project library is empty</h3>
                  <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                    Create your first AI-generated application and it will appear here
                  </p>
                  <Link href="/workflows">
                    <Button className="bg-[#00C2FF] text-white" data-testid="button-create-first">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Your First Project
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </>
  );
}
