"use client"

import { useState, forwardRef, useImperativeHandle } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Wallet, Plus, Eye, Check, Shield, AlertTriangle, RefreshCw } from "lucide-react"


interface WalletCreationProps {
  onWalletCreated: (walletName: string) => void
}

// eslint-disable-next-line react/display-name
export const WalletCreation = forwardRef<{ reset: () => void }, WalletCreationProps>(
  ({ onWalletCreated }, ref) => {
    const [walletName, setWalletName] = useState("")
    const [showSeedPhrase, setShowSeedPhrase] = useState(false)
    const [isCreating, setIsCreating] = useState(false)
    const [step, setStep] = useState<"name" | "generate" | "verify">("name")
    const mnemonic=localStorage.getItem("mnemonic");
   

    useImperativeHandle(ref, () => ({
      reset: () => {
        setWalletName("")
        setShowSeedPhrase(false)
        setIsCreating(false)
        setStep("name")
      }
    }))


  const handleCreateWallet = async () => {
    setIsCreating(true)
    // Simulate wallet creation
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setStep("generate")
    setIsCreating(false)
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      {step === "name" && (
        <Card>
          <CardHeader className="text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4">
              <Wallet className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Create New Wallet</CardTitle>
            <CardDescription>Set up a new cryptocurrency wallet to securely store your digital assets</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="wallet-name">Wallet Name</Label>
              <Input
                id="wallet-name"
                placeholder="Enter a name for your wallet"
                value={walletName}
                onChange={(e) => setWalletName(e.target.value)}
              />
            </div>

            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                Your wallet will be encrypted and secured with industry-standard security measures. Make sure to save
                your recovery phrase in a safe place.
              </AlertDescription>
            </Alert>

            <Button onClick={handleCreateWallet} disabled={!walletName.trim() || isCreating} className="w-full">
              {isCreating ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Creating Wallet...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Wallet
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {step === "generate" && (
        <Card>
          <CardHeader className="text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-destructive/10 rounded-full mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-destructive" />
            </div>
            <CardTitle className="text-2xl">Your Recovery Phrase</CardTitle>
            <CardDescription>
              Write down these 12 words in order and store them safely. This is the only way to recover your wallet.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert className="border-destructive/50 bg-destructive/5">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <AlertDescription className="text-destructive">
                <strong>Warning:</strong> Never share your recovery phrase with anyone. Store it offline in a secure
                location. Anyone with access to this phrase can control your wallet.
              </AlertDescription>
            </Alert>

            <div className="relative">
              <div className={`grid grid-cols-3 gap-3 p-4 bg-muted/30 rounded-lg ${!showSeedPhrase ? "blur-sm" : ""}`}>
                {mnemonic && mnemonic.split(" ").map((word, index) => (
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
                  <Button onClick={() => setShowSeedPhrase(true)} variant="outline">
                    <Eye className="w-4 h-4 mr-2" />
                    Reveal Seed Phrase
                  </Button>
                </div>
              )}
            </div>


            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                Write down all 12 words in the correct order
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                Store them in a secure, offline location
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                Never share your recovery phrase with anyone
              </div>
            </div>

            <Button onClick={() => setStep("verify")} className="w-full" disabled={!showSeedPhrase}>
              <Shield className="w-4 h-4 mr-2" />
              I&apos;ve Saved My Recovery Phrase
            </Button>
          </CardContent>
        </Card>
      )}

      {step === "verify" && (
        <Card>
          <CardHeader className="text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-green-500/10 rounded-full mx-auto mb-4">
              <Check className="w-8 h-8 text-green-500" />
            </div>
            <CardTitle className="text-2xl">Wallet Created Successfully!</CardTitle>
            <CardDescription>
              Your wallet &quot;{walletName}&quot; has been created and secured with your recovery phrase.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-green-500/5 border border-green-500/20 rounded-lg">
              <h3 className="font-semibold text-green-700 mb-2">Next Steps:</h3>
              <ul className="space-y-1 text-sm text-green-600">
                <li>• Your wallet is now ready to receive cryptocurrency</li>
                <li>• You can start by receiving your first transaction</li>
                <li>• Remember to keep your recovery phrase safe</li>
              </ul>
            </div>

            <Button className="w-full" onClick={() => onWalletCreated(walletName)}>
              <Wallet className="w-4 h-4 mr-2" />
              Go to Wallet Dashboard
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
})
