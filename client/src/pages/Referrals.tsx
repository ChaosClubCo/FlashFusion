import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import {
  Copy,
  Check,
  Users,
  DollarSign,
  Gift,
  Share2,
  Trophy,
  TrendingUp,
  Mail,
  MessageCircle,
  Twitter,
  Facebook,
  Linkedin,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { analytics } from '@/utils/events';
import { useAuth } from '@/hooks/useAuth';

// Types
interface ReferralData {
  referralCode: string;
  stats: {
    totalReferrals: number;
    activeReferrals: number;
    totalEarnings: number;
    pendingEarnings: number;
  };
  history: Array<{
    id: string;
    referredEmail: string;
    status: 'pending' | 'active' | 'converted';
    signupDate: string;
    reward: number;
    rewardStatus: 'pending' | 'paid';
  }>;
  tiers: Array<{
    name: string;
    referralsRequired: number;
    rewardPerReferral: number;
    bonusReward: number;
    unlocked: boolean;
  }>;
}

// Mock data generator
function generateMockReferralData(userId: string): ReferralData {
  const referralCode = `FF-${userId.substring(0, 8).toUpperCase()}`;

  return {
    referralCode,
    stats: {
      totalReferrals: 12,
      activeReferrals: 8,
      totalEarnings: 240,
      pendingEarnings: 60,
    },
    history: [
      {
        id: '1',
        referredEmail: 'john.doe@example.com',
        status: 'converted',
        signupDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        reward: 20,
        rewardStatus: 'paid',
      },
      {
        id: '2',
        referredEmail: 'jane.smith@example.com',
        status: 'active',
        signupDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        reward: 20,
        rewardStatus: 'paid',
      },
      {
        id: '3',
        referredEmail: 'bob.wilson@example.com',
        status: 'converted',
        signupDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        reward: 20,
        rewardStatus: 'paid',
      },
      {
        id: '4',
        referredEmail: 'alice.johnson@example.com',
        status: 'active',
        signupDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        reward: 20,
        rewardStatus: 'pending',
      },
      {
        id: '5',
        referredEmail: 'charlie.brown@example.com',
        status: 'pending',
        signupDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        reward: 20,
        rewardStatus: 'pending',
      },
    ],
    tiers: [
      {
        name: 'Bronze',
        referralsRequired: 5,
        rewardPerReferral: 20,
        bonusReward: 50,
        unlocked: true,
      },
      {
        name: 'Silver',
        referralsRequired: 10,
        rewardPerReferral: 25,
        bonusReward: 100,
        unlocked: true,
      },
      {
        name: 'Gold',
        referralsRequired: 25,
        rewardPerReferral: 30,
        bonusReward: 250,
        unlocked: false,
      },
      {
        name: 'Platinum',
        referralsRequired: 50,
        rewardPerReferral: 40,
        bonusReward: 500,
        unlocked: false,
      },
    ],
  };
}

export default function Referrals() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);

  // Fetch referral data from API
  const { data: apiData, isLoading, error } = useQuery<ReferralData>({
    queryKey: ['/api/referrals'],
    retry: 1,
  });

  // Use mock data if API fails or no user
  const mockData = user ? generateMockReferralData(user.id.toString()) : null;
  const data = error || !apiData ? mockData : apiData;

  useEffect(() => {
    analytics.track('landing_view');

    if (error) {
      toast({
        title: 'Using Demo Data',
        description: 'Unable to fetch referral information. Showing sample data.',
      });
    }
  }, [error, toast]);

  const referralUrl = data
    ? `${window.location.origin}?ref=${data.referralCode}`
    : '';

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      analytics.track('cta_click', { action: 'copy_referral_code' });
      toast({
        title: 'Copied!',
        description: 'Referral link copied to clipboard.',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to copy to clipboard.',
        variant: 'destructive',
      });
    }
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent('Join FlashFusion with my referral link!');
    const body = encodeURIComponent(
      `Hi!\n\nI've been using FlashFusion and thought you might be interested. Use my referral link to get started:\n\n${referralUrl}\n\nBest regards`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
    analytics.track('cta_click', { action: 'share_email' });
  };

  const shareViaTwitter = () => {
    const text = encodeURIComponent(
      `Just discovered FlashFusion - build apps 10x faster with AI! Join me using my referral link: ${referralUrl}`
    );
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
    analytics.track('cta_click', { action: 'share_twitter' });
  };

  const shareViaFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralUrl)}`,
      '_blank'
    );
    analytics.track('cta_click', { action: 'share_facebook' });
  };

  const shareViaLinkedIn = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralUrl)}`,
      '_blank'
    );
    analytics.track('cta_click', { action: 'share_linkedin' });
  };

  if (isLoading && !error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Users className="h-12 w-12 animate-pulse mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading referral information...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">No referral information available.</p>
        </div>
      </div>
    );
  }

  const currentTier = data.tiers.find((tier) => tier.unlocked) || data.tiers[0];
  const nextTier = data.tiers.find((tier) => !tier.unlocked);

  return (
    <>
      <Helmet>
        <title>Referral Program - FlashFusion</title>
        <meta name="description" content="Refer friends to FlashFusion and earn rewards." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <div className="container mx-auto py-8 px-4 max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Referral Program</h1>
            <p className="text-muted-foreground">
              Share FlashFusion with friends and earn rewards for every successful referral
            </p>
          </div>

          {/* Referral Code Card */}
          <Card className="mb-8 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
            <CardHeader>
              <CardTitle>Your Referral Link</CardTitle>
              <CardDescription>
                Share this link with your friends to earn rewards
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={referralUrl}
                  readOnly
                  className="font-mono text-sm"
                />
                <Button
                  onClick={() => copyToClipboard(referralUrl)}
                  className="shrink-0"
                >
                  {copied ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy
                    </>
                  )}
                </Button>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Share via:</p>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={shareViaEmail}>
                    <Mail className="mr-2 h-4 w-4" />
                    Email
                  </Button>
                  <Button variant="outline" size="sm" onClick={shareViaTwitter}>
                    <Twitter className="mr-2 h-4 w-4" />
                    Twitter
                  </Button>
                  <Button variant="outline" size="sm" onClick={shareViaFacebook}>
                    <Facebook className="mr-2 h-4 w-4" />
                    Facebook
                  </Button>
                  <Button variant="outline" size="sm" onClick={shareViaLinkedIn}>
                    <Linkedin className="mr-2 h-4 w-4" />
                    LinkedIn
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Referrals</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.stats.totalReferrals}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {data.stats.activeReferrals} active
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${data.stats.totalEarnings}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  ${data.stats.pendingEarnings} pending
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Current Tier</CardTitle>
                <Trophy className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{currentTier.name}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  ${currentTier.rewardPerReferral} per referral
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Next Reward</CardTitle>
                <Gift className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${nextTier ? nextTier.bonusReward : currentTier.bonusReward}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {nextTier
                    ? `${nextTier.referralsRequired - data.stats.totalReferrals} more referrals`
                    : 'Max tier reached!'}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Reward Tiers */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Reward Tiers</CardTitle>
              <CardDescription>
                Unlock higher rewards as you refer more friends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {data.tiers.map((tier, index) => {
                  const progress = Math.min(
                    (data.stats.totalReferrals / tier.referralsRequired) * 100,
                    100
                  );

                  return (
                    <div key={tier.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Trophy
                            className={`h-5 w-5 ${
                              tier.unlocked
                                ? 'text-yellow-500'
                                : 'text-muted-foreground'
                            }`}
                          />
                          <span className="font-semibold">{tier.name}</span>
                          {tier.unlocked && (
                            <Badge variant="default">Unlocked</Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {tier.referralsRequired} referrals
                        </div>
                      </div>

                      <Progress value={progress} className="h-2" />

                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          ${tier.rewardPerReferral} per referral
                        </span>
                        <span className="text-muted-foreground">
                          ${tier.bonusReward} bonus reward
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Referral History */}
          <Card>
            <CardHeader>
              <CardTitle>Referral History</CardTitle>
              <CardDescription>
                Track your referrals and rewards
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Signup Date</TableHead>
                    <TableHead>Reward</TableHead>
                    <TableHead>Reward Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.history.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground">
                        No referrals yet. Start sharing your link!
                      </TableCell>
                    </TableRow>
                  ) : (
                    data.history.map((referral) => (
                      <TableRow key={referral.id}>
                        <TableCell className="font-medium">
                          {referral.referredEmail}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              referral.status === 'converted'
                                ? 'default'
                                : referral.status === 'active'
                                ? 'secondary'
                                : 'outline'
                            }
                          >
                            {referral.status === 'converted' && (
                              <TrendingUp className="mr-1 h-3 w-3" />
                            )}
                            {referral.status === 'active' && (
                              <Check className="mr-1 h-3 w-3" />
                            )}
                            {referral.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(referral.signupDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>${referral.reward}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              referral.rewardStatus === 'paid'
                                ? 'default'
                                : 'outline'
                            }
                          >
                            {referral.rewardStatus}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* How it Works */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>How It Works</CardTitle>
              <CardDescription>
                Start earning rewards in 3 simple steps
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Share2 className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">1. Share Your Link</h3>
                  <p className="text-sm text-muted-foreground">
                    Share your unique referral link with friends via email, social
                    media, or any other channel.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">2. Friends Sign Up</h3>
                  <p className="text-sm text-muted-foreground">
                    Your friends create an account using your referral link and start
                    using FlashFusion.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Gift className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">3. Earn Rewards</h3>
                  <p className="text-sm text-muted-foreground">
                    You earn rewards when your friends subscribe. Unlock higher tiers
                    for even better rewards!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
