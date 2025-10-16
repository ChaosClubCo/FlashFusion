import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Sparkles, Image as ImageIcon, Download, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";

const STYLE_PRESETS = [
  { id: "photorealistic", name: "Photorealistic", icon: "📸", desc: "Ultra-realistic" },
  { id: "digital-art", name: "Digital Art", icon: "🎨", desc: "Artistic render" },
  { id: "sketch", name: "Sketch", icon: "✏️", desc: "Hand-drawn" },
  { id: "cinematic", name: "Cinematic", icon: "🎬", desc: "Movie quality" },
  { id: "anime", name: "Anime", icon: "🎭", desc: "Japanese style" },
  { id: "fantasy", name: "Fantasy", icon: "🔮", desc: "Magical realm" },
];

const SAMPLE_IMAGES = [
  { id: 1, emoji: "🌄", prompt: "A serene mountain landscape at sunset with vibrant orange and purple skies reflecting on a crystal-clear alpine lake", time: "2 min ago", style: "Photorealistic" },
  { id: 2, emoji: "🦋", prompt: "Ethereal butterfly with iridescent wings in a magical enchanted forest with glowing mushrooms and fireflies", time: "5 min ago", style: "Fantasy" },
  { id: 3, emoji: "🏙️", prompt: "Futuristic cyberpunk cityscape with neon lights, holographic billboards, and flying cars in the rain", time: "12 min ago", style: "Cinematic" },
  { id: 4, emoji: "🐉", prompt: "Majestic dragon perched on ancient stone ruins under a starlit sky with aurora borealis dancing above", time: "18 min ago", style: "Digital Art" },
  { id: 5, emoji: "🌊", prompt: "Powerful ocean waves crashing against dramatic coastal cliffs during a storm with dramatic lighting", time: "25 min ago", style: "Photorealistic" },
  { id: 6, emoji: "🌸", prompt: "Cherry blossom garden in full bloom with traditional Japanese architecture and stone pathways", time: "32 min ago", style: "Anime" },
];

export default function ImageGeneration() {
  const [prompt, setPrompt] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("photorealistic");
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState("");
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<typeof SAMPLE_IMAGES[0] | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a prompt",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to generate images",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    setProgressMessage("Starting generation...");
    setGeneratedImageUrl(null);

    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          prompt: prompt,
          style: selectedStyle,
          model: "dall-e-3",
          settings: JSON.stringify({
            size: "1024x1024",
            quality: "standard",
          }),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to start image generation");
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("No response body");
      }

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));

              if (data.type === "progress") {
                setProgress(data.progress);
                setProgressMessage(data.message);
              } else if (data.type === "complete") {
                setProgress(100);
                setProgressMessage("Complete!");
                setGeneratedImageUrl(data.result.imageUrl);
                toast({
                  title: "Success!",
                  description: "Image generated successfully",
                });
                setTimeout(() => {
                  setIsGenerating(false);
                  setProgress(0);
                  setProgressMessage("");
                }, 1000);
              } else if (data.type === "error") {
                throw new Error(data.error);
              }
            } catch (parseError) {
              console.error("Error parsing SSE data:", parseError);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error generating image:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate image",
        variant: "destructive",
      });
      setIsGenerating(false);
      setProgress(0);
      setProgressMessage("");
    }
  };

  return (
    <>
      <Helmet>
        <title>AI Image Generation - FlashFusion</title>
        <meta name="description" content="Transform your imagination into breathtaking AI-generated images with FlashFusion's professional-grade platform" />
      </Helmet>

      <div className="min-h-screen">
        {/* Hero Section */}
        <motion.section
          className="text-center py-20 px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-2 mb-6 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary">Powered by Advanced AI</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">
            Create{" "}
            <span className="bg-gradient-to-r from-primary via-secondary to-amber-500 bg-clip-text text-transparent">
              Stunning Visuals
            </span>
            <br />
            In Seconds
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Transform your imagination into breathtaking AI-generated images with our professional-grade platform
          </p>
        </motion.section>

        {/* Generator Section */}
        <motion.div
          className="max-w-5xl mx-auto px-4 pb-20"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="bg-card/40 backdrop-blur-xl border-white/10">
            <CardContent className="p-8 space-y-8">
              {/* Prompt Input */}
              <div className="space-y-3">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Your Prompt
                </label>
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe your vision in detail... e.g., 'A cyberpunk cityscape at night with neon-lit skyscrapers reflecting in rain-soaked streets, flying cars weaving between buildings, cinematic lighting, hyper-detailed, 8k quality'"
                  className="min-h-32 bg-background/60 border-white/10 focus:border-primary text-base resize-none"
                  data-testid="input-image-prompt"
                />
              </div>

              {/* Style Presets */}
              <div className="space-y-3">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Choose Your Style
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                  {STYLE_PRESETS.map((preset) => (
                    <Card
                      key={preset.id}
                      className={`cursor-pointer transition-all hover-elevate active-elevate-2 ${
                        selectedStyle === preset.id
                          ? "bg-primary/15 border-primary"
                          : "bg-card/40 border-white/10"
                      }`}
                      onClick={() => setSelectedStyle(preset.id)}
                      data-testid={`card-style-${preset.id}`}
                    >
                      <CardContent className="p-4 text-center space-y-2">
                        <div className="text-4xl mb-2">{preset.icon}</div>
                        <div className="font-semibold text-sm">{preset.name}</div>
                        <div className="text-xs text-muted-foreground">{preset.desc}</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Settings */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="bg-background/40 border-white/10">
                  <CardContent className="p-4">
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                      Aspect Ratio
                    </div>
                    <div className="text-lg font-bold">16:9</div>
                  </CardContent>
                </Card>
                <Card className="bg-background/40 border-white/10">
                  <CardContent className="p-4">
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                      Quality
                    </div>
                    <div className="text-lg font-bold">Ultra HD</div>
                  </CardContent>
                </Card>
                <Card className="bg-background/40 border-white/10">
                  <CardContent className="p-4">
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                      Resolution
                    </div>
                    <div className="text-lg font-bold">2048×1024</div>
                  </CardContent>
                </Card>
              </div>

              {/* Generate Button */}
              <div className="flex gap-4 justify-center">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white/20"
                  data-testid="button-advanced-options"
                >
                  Advanced Options
                </Button>
                <Button
                  size="lg"
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                  data-testid="button-generate-image"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generate Image
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Progress Section */}
          <AnimatePresence>
            {isGenerating && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-8"
              >
                <Card className="bg-card/40 backdrop-blur-xl border-white/10">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-semibold">{progressMessage || "Generating your masterpiece..."}</span>
                      <span className="font-bold text-primary">{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-3" />
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Generated Image Display */}
          <AnimatePresence>
            {generatedImageUrl && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="mt-8"
              >
                <Card className="bg-card/40 backdrop-blur-xl border-white/10">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">Your Generated Image</h3>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(generatedImageUrl, "_blank")}
                          data-testid="button-download-image"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setGeneratedImageUrl(null);
                            setPrompt("");
                          }}
                          data-testid="button-generate-another"
                        >
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Generate Another
                        </Button>
                      </div>
                    </div>
                    <div className="relative rounded-lg overflow-hidden bg-background/60">
                      <img
                        src={generatedImageUrl}
                        alt={prompt}
                        className="w-full h-auto"
                        data-testid="img-generated"
                      />
                    </div>
                    <p className="mt-4 text-sm text-muted-foreground">{prompt}</p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Gallery Section */}
        <div className="max-w-7xl mx-auto px-4 pb-20">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-black tracking-tight">Recent Creations</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="border-white/20">All</Button>
              <Button variant="ghost" size="sm">Today</Button>
              <Button variant="ghost" size="sm">This Week</Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SAMPLE_IMAGES.map((image, index) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card
                  className="group cursor-pointer hover-elevate active-elevate-2 overflow-hidden bg-card/40 border-white/10"
                  onClick={() => setSelectedImage(image)}
                  data-testid={`card-image-${image.id}`}
                >
                  <div className="h-60 flex items-center justify-center text-7xl bg-gradient-to-br from-primary/20 to-secondary/20 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    {image.emoji}
                  </div>
                  <CardContent className="p-5">
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {image.prompt}
                    </p>
                    <div className="flex justify-between items-center pt-4 border-t border-white/10">
                      <span className="text-xs text-muted-foreground">{image.time}</span>
                      <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-md">
                        {image.style}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Image Detail Modal */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              className="fixed inset-0 bg-background/90 backdrop-blur-xl z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedImage(null)}
            >
              <motion.div
                className="max-w-3xl w-full"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <Card className="bg-card/95 backdrop-blur-xl border-white/10">
                  <CardContent className="p-0">
                    <div className="flex justify-between items-center p-6 border-b border-white/10">
                      <h3 className="text-xl font-bold">Image Details</h3>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedImage(null)}
                        data-testid="button-close-modal"
                      >
                        ×
                      </Button>
                    </div>
                    <div className="p-6 space-y-6">
                      <div className="h-80 flex items-center justify-center text-9xl bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg">
                        {selectedImage.emoji}
                      </div>
                      <p className="text-muted-foreground leading-relaxed">
                        {selectedImage.prompt}
                      </p>
                      <div className="flex gap-3">
                        <Button className="flex-1" data-testid="button-download-image">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                        <Button variant="outline" className="flex-1 border-white/20" data-testid="button-remix-image">
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Remix
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
