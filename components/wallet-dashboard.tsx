"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Send,
  Download,
  Shield,
  Eye,
  EyeOff,
  Bitcoin,
  Zap,
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  Key,
  ChevronDown,
  Check,
  Copy,
} from "lucide-react"
import { WalletCreation } from "./wallet-creation"
import { SeedPhraseManager } from "./seed-phrase-manager"
import {mnemonicToSeed} from "bip39"
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import nacl from "tweetnacl"


export function WalletDashboard() {
  const [balanceVisible, setBalanceVisible] = useState(true)
  const [activeWalletId, setActiveWalletId] = useState("main")
  const [copied, setCopied] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isWalletDialogOpen, setIsWalletDialogOpen] = useState(false)
  const walletCreationRef = useRef<{ reset: () => void }>(null)
  
  const [wallets, setWallets] = useState([
    {
      id: "main",
      name: "Main Wallet",
      address: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
      balance: "$63,275.00",
      type: "Primary",
    },
    {
      id: "trading",
      name: "Trading Wallet",
      address: "3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy",
      balance: "$24,850.00",
      type: "Trading",
    },
    {
      id: "savings",
      name: "Savings Vault",
      address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
      balance: "$156,420.00",
      type: "Cold Storage",
    },
  ])

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(activeWallet.address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy address:", err)
    }
  }

  const addNewWallet = (walletName: string) => {
    const newWallet = {
      id: `wallet-${Date.now()}`,
      name: walletName,
      address: generateWalletAddress(),
      balance: "$0.00",
      type: "Standard",
    }
    setWallets(prevWallets => [...prevWallets, newWallet])
    setActiveWalletId(newWallet.id)
    setIsWalletDialogOpen(false)
  }

  const generateWalletAddress = () => {
    const mnemonic=localStorage.getItem("mnemonic");
    if(!mnemonic) return "";
    const seed=mnemonicToSeed(mnemonic);
    
    const path=`m/44'/501'/${currentIndex}'/0'`;
    const derivedSeed=derivePath(path,seed.toString()).key;
    const secret=nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
    const keypair=Keypair.fromSecretKey(secret);
    setCurrentIndex(currentIndex+1);

    return keypair.publicKey.toBase58();
  }

  useEffect(() => {
    if (!isWalletDialogOpen && walletCreationRef.current) {
      walletCreationRef.current.reset()
    }
  }, [isWalletDialogOpen])

  const activeWallet = wallets.find((w) => w.id === activeWalletId) || wallets[0]

  const walletPortfolioData = {
    main: [
      {
        name: "Bitcoin",
        symbol: "BTC",
        amount: "0.5847",
        value: "$28,450.00",
        change: "+5.2%",
        positive: true,
        color: "bg-orange-500",
      },
      {
        name: "Ethereum",
        symbol: "ETH",
        amount: "12.34",
        value: "$24,680.00",
        change: "+3.1%",
        positive: true,
        color: "bg-blue-500",
      },
      {
        name: "Solana",
        symbol: "SOL",
        amount: "156.7",
        value: "$8,920.00",
        change: "-2.4%",
        positive: false,
        color: "bg-purple-500",
      },
      {
        name: "Cardano",
        symbol: "ADA",
        amount: "2,450",
        value: "$1,225.00",
        change: "+1.8%",
        positive: true,
        color: "bg-green-500",
      },
    ],
    trading: [
      {
        name: "Bitcoin",
        symbol: "BTC",
        amount: "0.2156",
        value: "$10,500.00",
        change: "+2.8%",
        positive: true,
        color: "bg-orange-500",
      },
      {
        name: "Ethereum",
        symbol: "ETH",
        amount: "5.67",
        value: "$11,340.00",
        change: "+4.2%",
        positive: true,
        color: "bg-blue-500",
      },
      {
        name: "Chainlink",
        symbol: "LINK",
        amount: "234.5",
        value: "$3,010.00",
        change: "-1.5%",
        positive: false,
        color: "bg-blue-600",
      },
    ],
    savings: [
      {
        name: "Bitcoin",
        symbol: "BTC",
        amount: "2.1847",
        value: "$106,420.00",
        change: "+6.1%",
        positive: true,
        color: "bg-orange-500",
      },
      {
        name: "Ethereum",
        symbol: "ETH",
        amount: "25.0",
        value: "$50,000.00",
        change: "+3.8%",
        positive: true,
        color: "bg-blue-500",
      },
    ],
  }

  const walletTransactions = {
    main: [
      {
        type: "receive",
        asset: "BTC",
        amount: "+0.0234",
        value: "+$1,140.00",
        time: "2 hours ago",
        status: "completed",
      },
      { type: "send", asset: "ETH", amount: "-2.5", value: "-$5,000.00", time: "1 day ago", status: "completed" },
      { type: "receive", asset: "SOL", amount: "+45.2", value: "+$2,580.00", time: "3 days ago", status: "completed" },
      { type: "send", asset: "BTC", amount: "-0.1", value: "-$4,870.00", time: "1 week ago", status: "completed" },
    ],
    trading: [
      { type: "send", asset: "BTC", amount: "-0.05", value: "-$2,435.00", time: "1 hour ago", status: "completed" },
      { type: "receive", asset: "ETH", amount: "+1.2", value: "+$2,400.00", time: "4 hours ago", status: "completed" },
      { type: "send", asset: "LINK", amount: "-50.0", value: "-$642.00", time: "1 day ago", status: "completed" },
      { type: "receive", asset: "BTC", amount: "+0.08", value: "+$3,896.00", time: "2 days ago", status: "completed" },
    ],
    savings: [
      { type: "receive", asset: "BTC", amount: "+0.5", value: "+$24,350.00", time: "1 week ago", status: "completed" },
      { type: "receive", asset: "ETH", amount: "+5.0", value: "+$10,000.00", time: "2 weeks ago", status: "completed" },
      { type: "receive", asset: "BTC", amount: "+1.0", value: "+$48,700.00", time: "1 month ago", status: "completed" },
    ],
  }

  const portfolioData =
    walletPortfolioData[activeWalletId as keyof typeof walletPortfolioData] || []
  const transactions = walletTransactions[activeWalletId as keyof typeof walletTransactions] || []

  const totalValue = portfolioData.length > 0 
    ? portfolioData.reduce(
        (sum, asset) => sum + Number.parseFloat(asset.value.replace("$", "").replace(",", "")),
        0,
      )
    : 0

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
                <Wallet className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">CryptoVault</h1>
                <p className="text-sm text-muted-foreground">Secure Digital Wallet</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="min-w-[200px] justify-between bg-transparent">
                    <div className="flex items-center gap-2">
                      <Wallet className="w-4 h-4" />
                      <div className="text-left">
                        <div className="font-medium">{activeWallet.name}</div>
                        <div className="text-xs text-muted-foreground">{activeWallet.type}</div>
                      </div>
                    </div>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[280px]">
                  <DropdownMenuLabel>Switch Wallet</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {wallets.map((wallet) => (
                    <DropdownMenuItem
                      key={wallet.id}
                      onClick={() => setActiveWalletId(wallet.id)}
                      className="flex items-center justify-between p-3 cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 bg-muted rounded-lg">
                          <Wallet className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-medium">{wallet.name}</div>
                          <div className="text-xs text-muted-foreground">{wallet.type}</div>
                          <div className="text-xs text-muted-foreground font-mono">
                            {wallet.address.slice(0, 8)}...{wallet.address.slice(-6)}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-sm">{wallet.balance}</div>
                        {activeWalletId === wallet.id && <Check className="w-4 h-4 text-primary mt-1" />}
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Dialog open={isWalletDialogOpen} onOpenChange={setIsWalletDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    New Wallet
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Create New Wallet</DialogTitle>
                    <DialogDescription>
                      Set up a new cryptocurrency wallet with secure recovery phrase
                    </DialogDescription>
                  </DialogHeader>
                  <WalletCreation ref={walletCreationRef} onWalletCreated={addNewWallet} />
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Key className="w-4 h-4 mr-2" />
                    Recovery Phrase
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Manage Recovery Phrase</DialogTitle>
                    <DialogDescription>View and manage your wallet&apos;s recovery phrase securely</DialogDescription>
                  </DialogHeader>
                  <SeedPhraseManager />
                </DialogContent>
              </Dialog>

              <Button variant="outline" size="sm">
                <Shield className="w-4 h-4 mr-2" />
                Security
              </Button>
              <Avatar>
                <AvatarImage src="/generic-user-avatar.png" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Card className="bg-muted/30 border-border/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-foreground">{activeWallet.name}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-sm text-muted-foreground font-mono">
                      {activeWallet.type} • {activeWallet.address}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={copyAddress}
                      className="h-6 px-2 text-muted-foreground hover:text-foreground"
                    >
                      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    </Button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-foreground">
                    {balanceVisible ? activeWallet.balance : "••••••"}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Balance</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Portfolio Overview */}
            <Card className="bg-gradient-to-br from-card to-card/80 border-border/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl font-bold">Portfolio Balance</CardTitle>
                    <CardDescription>Your total cryptocurrency holdings</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setBalanceVisible(!balanceVisible)}>
                    {balanceVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-foreground">
                      {balanceVisible ? `$${totalValue.toLocaleString()}` : "••••••"}
                    </span>
                    {portfolioData.length > 0 && (
                      <Badge variant="secondary" className="bg-secondary/20 text-secondary-foreground">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        {activeWalletId === "main" ? "+12.5%" : activeWalletId === "trading" ? "+8.2%" : activeWalletId === "savings" ? "+15.1%" : "+0.0%"}
                      </Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground">
                    {balanceVisible
                      ? portfolioData.length > 0
                        ? activeWalletId === "main"
                          ? "+$7,240.00 (24h)"
                          : activeWalletId === "trading"
                            ? "+$1,890.00 (24h)"
                            : activeWalletId === "savings"
                              ? "+$19,850.00 (24h)"
                              : "+$0.00 (24h)"
                        : "+$0.00 (24h)"
                      : "•••••••••"}
                  </p>
                  <div className="flex gap-3 pt-4">
                    <Button className="flex-1">
                      <Send className="w-4 h-4 mr-2" />
                      Send
                    </Button>
                    <Button variant="outline" className="flex-1 bg-transparent">
                      <Download className="w-4 h-4 mr-2" />
                      Receive
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Assets */}
            <Card>
              <CardHeader>
                <CardTitle>Your Assets</CardTitle>
                <CardDescription>Cryptocurrency holdings and performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {portfolioData.length > 0 ? (
                    portfolioData.map((asset, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full ${asset.color} flex items-center justify-center`}>
                            <span className="text-white font-bold text-sm">{asset.symbol[0]}</span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground">{asset.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {asset.amount} {asset.symbol}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-foreground">{balanceVisible ? asset.value : "••••••"}</p>
                          <div className="flex items-center gap-1">
                            {asset.positive ? (
                              <TrendingUp className="w-3 h-3 text-secondary" />
                            ) : (
                              <TrendingDown className="w-3 h-3 text-destructive" />
                            )}
                            <span className={`text-sm ${asset.positive ? "text-secondary" : "text-destructive"}`}>
                              {asset.change}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Wallet className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">No Assets Yet</h3>
                      <p className="text-muted-foreground mb-4">This wallet is ready to receive cryptocurrency</p>
                      <Button variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Receive Crypto
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Bitcoin className="w-4 h-4 mr-3" />
                  Buy Crypto
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Zap className="w-4 h-4 mr-3" />
                  Swap Tokens
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Shield className="w-4 h-4 mr-3" />
                  Security Settings
                </Button>
              </CardContent>
            </Card>

            {/* Security Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  Security Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Security Score</span>
                    <span className="font-semibold">85%</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span>2FA Enabled</span>
                    <Badge variant="secondary" className="bg-secondary/20">
                      Active
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Backup Phrase</span>
                    <Badge variant="outline">Verified</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Biometric Lock</span>
                    <Badge variant="destructive" className="bg-destructive/20">
                      Setup
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions.length > 0 ? (
                    transactions.slice(0, 3).map((tx, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            tx.type === "receive" ? "bg-secondary/20" : "bg-muted"
                          }`}
                        >
                          {tx.type === "receive" ? (
                            <ArrowDownLeft className="w-4 h-4 text-secondary" />
                          ) : (
                            <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {tx.type === "receive" ? "Received" : "Sent"} {tx.asset}
                          </p>
                          <p className="text-xs text-muted-foreground">{tx.time}</p>
                        </div>
                        <div className="text-right">
                          <p
                            className={`text-sm font-medium ${
                              tx.type === "receive" ? "text-secondary" : "text-foreground"
                            }`}
                          >
                            {balanceVisible ? tx.amount : "••••"}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6">
                      <div className="w-12 h-12 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-3">
                        <ArrowUpRight className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <p className="text-sm text-muted-foreground">No recent activity</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
