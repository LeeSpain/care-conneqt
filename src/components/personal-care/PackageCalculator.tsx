import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Minus, Share2, Bookmark } from "lucide-react";
import { packages, deviceOptions } from "@/data/pricing";
import { toast } from "sonner";

export const PackageCalculator = () => {
  const [selectedPackage, setSelectedPackage] = useState(packages[1].id);
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);
  const [additionalDashboards, setAdditionalDashboards] = useState(0);

  const currentPackage = packages.find(p => p.id === selectedPackage)!;
  const basePrice = currentPackage.price;
  const devicesPrice = selectedDevices.reduce((sum, deviceId) => {
    const device = deviceOptions.find(d => d.id === deviceId);
    return sum + (device?.price || 0);
  }, 0);
  const dashboardPrice = additionalDashboards * 2.99;
  const totalPrice = basePrice + devicesPrice + dashboardPrice;

  const handleDeviceToggle = (deviceId: string) => {
    setSelectedDevices(prev =>
      prev.includes(deviceId)
        ? prev.filter(id => id !== deviceId)
        : [...prev, deviceId]
    );
  };

  const handleSaveConfig = () => {
    const config = {
      package: selectedPackage,
      devices: selectedDevices,
      dashboards: additionalDashboards,
      total: totalPrice
    };
    const configString = btoa(JSON.stringify(config));
    const url = `${window.location.origin}/personal-care?config=${configString}`;
    navigator.clipboard.writeText(url);
    toast.success("Configuration link copied to clipboard!");
  };

  const handleShareConfig = () => {
    const config = {
      package: currentPackage.name,
      devices: selectedDevices.length,
      dashboards: additionalDashboards,
      total: totalPrice.toFixed(2)
    };
    const text = `Check out my Care Conneqt package: ${config.package} + ${config.devices} devices + ${config.dashboards} family dashboards = €${config.total}/month`;
    navigator.clipboard.writeText(text);
    toast.success("Configuration copied to clipboard!");
  };

  return (
    <div className="space-y-6">
      <Card className="border-2 border-secondary/20">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Build Your Care Package</span>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={handleSaveConfig}>
                <Bookmark className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button size="sm" variant="outline" onClick={handleShareConfig}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Base Package Selection */}
          <div>
            <Label className="text-base font-semibold mb-3 block">1. Choose Your Base Package</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {packages.map((pkg) => (
                <button
                  key={pkg.id}
                  onClick={() => setSelectedPackage(pkg.id)}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    selectedPackage === pkg.id
                      ? 'border-secondary bg-secondary/5'
                      : 'border-border hover:border-secondary/50'
                  }`}
                >
                  {pkg.popular && (
                    <Badge className="mb-2 bg-secondary">Most Popular</Badge>
                  )}
                  <div className="font-semibold">{pkg.name}</div>
                  <div className="text-2xl font-bold text-primary mt-1">€{pkg.price}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {pkg.devicesIncluded} device{pkg.devicesIncluded !== 1 ? 's' : ''} included
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Additional Devices */}
          <div>
            <Label className="text-base font-semibold mb-3 block">
              2. Add Extra Devices (Optional)
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {deviceOptions.map((device) => (
                <div
                  key={device.id}
                  className={`flex items-start gap-3 p-4 rounded-lg border transition-all ${
                    selectedDevices.includes(device.id)
                      ? 'border-secondary bg-secondary/5'
                      : 'border-border'
                  }`}
                >
                  <Checkbox
                    id={device.id}
                    checked={selectedDevices.includes(device.id)}
                    onCheckedChange={() => handleDeviceToggle(device.id)}
                  />
                  <div className="flex-1">
                    <Label htmlFor={device.id} className="cursor-pointer">
                      <div className="font-semibold">{device.name}</div>
                      <div className="text-sm text-muted-foreground">{device.description}</div>
                      <div className="text-sm font-semibold text-secondary mt-1">
                        +€{device.price}/month
                      </div>
                    </Label>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Family Dashboards */}
          <div>
            <Label className="text-base font-semibold mb-3 block">
              3. Additional Family Dashboards
            </Label>
            <div className="flex items-center gap-4 p-4 rounded-lg border border-border">
              <div className="flex-1">
                <div className="font-semibold">Family/Carer Dashboards</div>
                <div className="text-sm text-muted-foreground">
                  {currentPackage.familyDashboards === -1 
                    ? 'Unlimited dashboards included in this tier'
                    : `${currentPackage.familyDashboards} dashboard${currentPackage.familyDashboards !== 1 ? 's' : ''} included`}
                </div>
                <div className="text-sm font-semibold text-secondary mt-1">
                  €2.99/month per additional user
                </div>
              </div>
              {currentPackage.familyDashboards !== -1 && (
                <div className="flex items-center gap-3">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setAdditionalDashboards(Math.max(0, additionalDashboards - 1))}
                    disabled={additionalDashboards === 0}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="font-semibold text-lg w-8 text-center">{additionalDashboards}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setAdditionalDashboards(additionalDashboards + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="bg-muted/50 rounded-lg p-6 space-y-3">
            <div className="text-lg font-semibold mb-3">Your Monthly Total</div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Base Package ({currentPackage.name})</span>
                <span className="font-semibold">€{basePrice.toFixed(2)}</span>
              </div>
              {selectedDevices.length > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Additional Devices ({selectedDevices.length})
                  </span>
                  <span className="font-semibold">€{devicesPrice.toFixed(2)}</span>
                </div>
              )}
              {additionalDashboards > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Extra Family Dashboards ({additionalDashboards})
                  </span>
                  <span className="font-semibold">€{dashboardPrice.toFixed(2)}</span>
                </div>
              )}
              <div className="h-px bg-border my-3" />
              <div className="flex justify-between text-xl">
                <span className="font-bold">Total per Month</span>
                <span className="font-bold text-primary">€{totalPrice.toFixed(2)}</span>
              </div>
            </div>
            <Button className="w-full mt-4 bg-secondary hover:bg-secondary/90" asChild>
              <a href="/auth/signup">Get Started with This Package</a>
            </Button>
            <p className="text-xs text-center text-muted-foreground mt-2">
              30-day money-back guarantee • Cancel anytime
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
