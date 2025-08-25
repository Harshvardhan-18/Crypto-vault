"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Copy, Check, Shield, AlertTriangle, Key, Lock } from "lucide-react"
import {generateMnemonic} from "bip39";

export function SeedPhraseManager() {
  const [password, setPassword] = useState("")
  const [showSeedPhrase, setShowSeedPhrase] = useState(false)
  const [copiedSeed, setCopiedSeed] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [mnemonic,setMnemonic]=useState(()=>generateMnemonic());


  useEffect(()=>{
    const saved = localStorage.getItem("mnemonic");
    if(saved){
      setMnemonic(saved);
    }else{

      const mn=generateMnemonic();
      setMnemonic(mn);
      localStorage.setItem("mnemonic",mn);
    }


  },[])

  const handleVerifyPassword = async () => {
    setIsVerifying(true)
    // Simulate password verification
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Mock password check (in real app, this would verify against encrypted storage)
    if (password === "demo123") {
      setIsAuthenticated(true)
    } else {
      alert("Incorrect password")
    }
    setIsVerifying(false)
  }

  const copySeedPhrase = async () => {
    await navigator.clipboard.writeText(mnemonic)
    setCopiedSeed(true)
    setTimeout(() => setCopiedSeed(false), 2000)
  }

  const toggleSeedVisibility = () => {
    setShowSeedPhrase(!showSeedPhrase)
  }

  if (!isAuthenticated) {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-xl">Verify Your Identity</CardTitle>
          <CardDescription>Enter your wallet password to view your recovery phrase</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="border-amber-500/50 bg-amber-500/5">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <AlertDescription className="text-amber-700">
              Your recovery phrase is encrypted and requires authentication to view.
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Label htmlFor="password">Wallet Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleVerifyPassword()}
            />
            <p className="text-xs text-muted-foreground">Demo password: demo123</p>
          </div>

          <Button onClick={handleVerifyPassword} disabled={!password || isVerifying} className="w-full">
            {isVerifying ? "Verifying..." : "Unlock Recovery Phrase"}
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4">
          <Key className="w-8 h-8 text-primary" />
        </div>
        <CardTitle className="text-xl">Recovery Phrase</CardTitle>
        <CardDescription>Your 12-word recovery phrase for wallet restoration</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert className="border-destructive/50 bg-destructive/5">
          <Shield className="h-4 w-4 text-destructive" />
          <AlertDescription className="text-destructive">
            <strong>Security Warning:</strong> Never share this phrase with anyone. Anyone with access to these words
            can control your entire wallet.
          </AlertDescription>
        </Alert>

        <div className="relative">
          <div
            className={`grid grid-cols-3 gap-3 p-4 bg-muted/30 rounded-lg transition-all ${!showSeedPhrase ? "blur-sm" : ""}`}
          >
            {mnemonic.split(" ").map((word, index) => (
  <div 
    key={index} 
    className="flex items-center gap-2 p-3 bg-background rounded border"
  >
    <span className="text-xs text-muted-foreground w-6 font-mono">
      {index + 1}.
    </span>
    <span className="font-mono font-medium text-sm">{word}</span>
  </div>
))}

          </div>

          {!showSeedPhrase && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Button onClick={toggleSeedVisibility} variant="outline" size="lg">
                <Eye className="w-4 h-4 mr-2" />
                Reveal Recovery Phrase
              </Button>
            </div>
          )}
        </div>

        {showSeedPhrase && (
          <div className="space-y-4">
            <div className="flex gap-3">
              <Button onClick={copySeedPhrase} variant="outline" className="flex-1 bg-transparent">
                {copiedSeed ? (
                  <>
                    <Check className="w-4 h-4 mr-2 text-green-500" />
                    Copied to Clipboard!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Recovery Phrase
                  </>
                )}
              </Button>
              <Button onClick={toggleSeedVisibility} variant="outline">
                <EyeOff className="w-4 h-4" />
              </Button>
            </div>

            <div className="p-4 bg-muted/30 rounded-lg">
              <h3 className="font-semibold mb-2 text-sm">Security Best Practices:</h3>
              <ul className="space-y-1 text-xs text-muted-foreground">
                <li>• Store this phrase offline in a secure location</li>
                <li>• Consider using a hardware wallet for additional security</li>
                <li>• Never store this phrase digitally or in cloud storage</li>
                <li>• Make multiple physical copies and store them separately</li>
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
