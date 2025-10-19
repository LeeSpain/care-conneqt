import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Plus, Minus, Share2, Bookmark, Check, Info } from "lucide-react";
import { packages, deviceOptions } from "@/data/pricing";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
    toast.success("Package configuration link copied!");
  };

  const handleShareConfig = () => {
    const config = {
      package: currentPackage.name,
      devices: selectedDevices.length,
      dashboards: additionalDashboards,
      total: totalPrice.toFixed(2)
    };
    const text = `My Care Conneqt Package:\n${config.package} + ${config.devices} extra device${config.devices !== 1 ? 's' : ''} + ${config.dashboards} additional dashboard${config.dashboards !== 1 ? 's' : ''}\nTotal: €${config.total}/month`;
    navigator.clipboard.writeText(text);
    toast.success("Configuration copied to clipboard!");
  };

  const getDeviceTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'wearable': 'Wearable Device',
      'emergency': 'Emergency Response',
      'home-monitoring': 'Home Monitoring',
      'medication': 'Medication Management',
      'cognitive': 'Cognitive Support',
      'health': 'Health Monitoring'
    };
    return labels[type] || type;
  };

  // Group devices by type
  const devicesByType = deviceOptions.reduce((acc, device) => {
    if (!acc[device.type]) {
      acc[device.type] = [];
    }
    acc[device.type].push(device);
    return acc;
  }, {} as Record<string, typeof deviceOptions>);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Configuration Panel */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="border-2 border-primary/10 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl font-['Poppins'] mb-2">
                    Build Your Personalized Care Package
                  </CardTitle>
                  <CardDescription className="text-base">
                    Customize your care plan with devices and services tailored to your needs
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button size="sm" variant="outline" onClick={handleSaveConfig}>
                          <Bookmark className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Save configuration link</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button size="sm" variant="outline" onClick={handleShareConfig}>
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Share configuration</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-8 space-y-10">
              {/* Step 1: Base Package Selection */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white font-bold text-lg">
                    1
                  </div>
                  <div>
                    <Label className="text-xl font-bold font-['Poppins']">Select Your Base Package</Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      All packages include AI Guardian, nurse support, and emergency response
                    </p>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  {packages.map((pkg) => (
                    <button
                      key={pkg.id}
                      onClick={() => setSelectedPackage(pkg.id)}
                      className={`relative p-6 rounded-xl border-2 text-left transition-all group ${
                        selectedPackage === pkg.id
                          ? 'border-secondary bg-secondary/10 shadow-md'
                          : 'border-border hover:border-secondary/40 hover:shadow-sm'
                      }`}
                    >
                      {selectedPackage === pkg.id && (
                        <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                          <Check className="h-5 w-5 text-white" />
                        </div>
                      )}
                      {pkg.popular && (
                        <Badge className="mb-3 bg-secondary hover:bg-secondary">
                          Most Popular
                        </Badge>
                      )}
                      <div className="font-bold text-lg mb-1">{pkg.name}</div>
                      <div className="flex items-baseline gap-1 mb-3">
                        <span className="text-3xl font-bold text-primary">€{pkg.price}</span>
                        <span className="text-muted-foreground text-sm">/month</span>
                      </div>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Check className="h-3 w-3 text-secondary" />
                          <span>{pkg.devicesIncluded} device{pkg.devicesIncluded !== 1 ? 's' : ''} included</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Check className="h-3 w-3 text-secondary" />
                          <span>
                            {pkg.familyDashboards === -1 
                              ? 'Unlimited family dashboards' 
                              : pkg.familyDashboards === 0 
                                ? 'Member dashboard only'
                                : `${pkg.familyDashboards} family dashboard${pkg.familyDashboards !== 1 ? 's' : ''}`
                            }
                          </span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Step 2: Additional Devices */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white font-bold text-lg">
                    2
                  </div>
                  <div>
                    <Label className="text-xl font-bold font-['Poppins']">Add Extra Devices (Optional)</Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Enhance your package with additional monitoring devices
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {Object.entries(devicesByType).map(([type, devices]) => (
                    <div key={type}>
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                        {getDeviceTypeLabel(type)}
                      </h4>
                      <div className="grid sm:grid-cols-2 gap-2">
                        {devices.map((device) => (
                          <div
                            key={device.id}
                            className={`relative p-3 rounded-lg border transition-all cursor-pointer ${
                              selectedDevices.includes(device.id)
                                ? 'border-secondary bg-secondary/5'
                                : 'border-border hover:border-secondary/30'
                            }`}
                            onClick={() => handleDeviceToggle(device.id)}
                          >
                            <div className="flex gap-2">
                              <Checkbox
                                id={device.id}
                                checked={selectedDevices.includes(device.id)}
                                onCheckedChange={() => handleDeviceToggle(device.id)}
                                className="mt-0.5"
                              />
                              <div className="flex-1 min-w-0">
                                <Label htmlFor={device.id} className="cursor-pointer font-semibold text-sm leading-tight">
                                  {device.name}
                                </Label>
                                <p className="text-xs text-muted-foreground mt-1 leading-snug line-clamp-2">
                                  {device.description}
                                </p>
                                <div className="flex items-baseline gap-1 mt-1.5">
                                  <span className="text-base font-bold text-secondary">+€{device.price}</span>
                                  <span className="text-xs text-muted-foreground">/mo</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Step 3: Family Dashboards */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white font-bold text-lg">
                    3
                  </div>
                  <div>
                    <Label className="text-xl font-bold font-['Poppins']">Additional Family Dashboards</Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Share access with more family members and caregivers
                    </p>
                  </div>
                </div>
                
                <Card className="border-2">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="font-semibold text-lg mb-1">Family/Carer Dashboard Access</div>
                        <div className="text-sm text-muted-foreground mb-2">
                          {currentPackage.familyDashboards === -1 
                            ? '✅ Unlimited dashboards included in this package'
                            : currentPackage.familyDashboards === 0
                              ? 'Base package includes member dashboard only'
                              : `${currentPackage.familyDashboards} dashboard${currentPackage.familyDashboards !== 1 ? 's' : ''} included in your package`}
                        </div>
                        {currentPackage.familyDashboards !== -1 && (
                          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/10 text-sm font-semibold text-secondary">
                            <Plus className="h-3 w-3" />
                            €2.99/month per additional user
                          </div>
                        )}
                      </div>
                      {currentPackage.familyDashboards !== -1 && (
                        <div className="flex items-center gap-3 bg-muted px-4 py-3 rounded-lg">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setAdditionalDashboards(Math.max(0, additionalDashboards - 1))}
                            disabled={additionalDashboards === 0}
                            className="h-10 w-10 p-0"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="font-bold text-2xl w-12 text-center">{additionalDashboards}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setAdditionalDashboards(additionalDashboards + 1)}
                            className="h-10 w-10 p-0"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Summary Panel - Sticky */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <Card className="border-2 border-secondary/20 shadow-xl">
              <CardHeader className="bg-gradient-to-br from-primary/5 to-secondary/5">
                <CardTitle className="text-xl font-['Poppins']">Package Summary</CardTitle>
                <CardDescription>Your monthly investment in care</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                {/* Base Package */}
                <div>
                  <div className="text-sm font-semibold text-muted-foreground mb-3">BASE PACKAGE</div>
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <div className="font-semibold">{currentPackage.name}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {currentPackage.devicesIncluded} device{currentPackage.devicesIncluded !== 1 ? 's' : ''} • 
                        {currentPackage.familyDashboards === -1 
                          ? ' Unlimited dashboards' 
                          : currentPackage.familyDashboards === 0
                            ? ' Member only'
                            : ` ${currentPackage.familyDashboards} dashboard${currentPackage.familyDashboards !== 1 ? 's' : ''}`
                        }
                      </div>
                    </div>
                    <div className="font-bold text-lg">€{basePrice.toFixed(2)}</div>
                  </div>
                </div>

                <Separator />

                {/* Additional Devices */}
                {selectedDevices.length > 0 && (
                  <>
                    <div>
                      <div className="text-sm font-semibold text-muted-foreground mb-3">
                        ADDITIONAL DEVICES ({selectedDevices.length})
                      </div>
                      <div className="space-y-2">
                        {selectedDevices.map((deviceId) => {
                          const device = deviceOptions.find(d => d.id === deviceId);
                          return device ? (
                            <div key={deviceId} className="flex justify-between items-center text-sm">
                              <span className="text-muted-foreground">{device.name}</span>
                              <span className="font-semibold">€{device.price.toFixed(2)}</span>
                            </div>
                          ) : null;
                        })}
                      </div>
                      <div className="flex justify-between items-center mt-3 pt-3 border-t">
                        <span className="font-semibold">Devices Subtotal</span>
                        <span className="font-bold">€{devicesPrice.toFixed(2)}</span>
                      </div>
                    </div>
                    <Separator />
                  </>
                )}

                {/* Additional Dashboards */}
                {additionalDashboards > 0 && (
                  <>
                    <div>
                      <div className="text-sm font-semibold text-muted-foreground mb-3">ADDITIONAL SERVICES</div>
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-semibold">Extra Family Dashboards</div>
                          <div className="text-xs text-muted-foreground">{additionalDashboards} × €2.99</div>
                        </div>
                        <div className="font-bold">€{dashboardPrice.toFixed(2)}</div>
                      </div>
                    </div>
                    <Separator />
                  </>
                )}

                {/* Total */}
                <div className="bg-primary/5 -mx-6 -mb-6 px-6 py-6 rounded-b-lg">
                  <div className="flex justify-between items-baseline mb-6">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">{t('personal-care:calculator.monthlyTotal')}</div>
                      <div className="text-4xl font-bold text-primary">€{totalPrice.toFixed(2)}</div>
                    </div>
                  </div>
                  
                  <Button className="w-full h-12 text-base bg-secondary hover:bg-secondary/90" asChild>
                    <a href="/auth/signup">{t('personal-care:calculator.getStarted')}</a>
                  </Button>
                  
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Check className="h-3 w-3 text-secondary" />
                      <span>{t('personal-care:guarantee.agreement')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Check className="h-3 w-3 text-secondary" />
                      <span>{t('personal-care:guarantee.noSetup')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Check className="h-3 w-3 text-secondary" />
                      <span>{t('personal-care:guarantee.protection')}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-border/50">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-start gap-2 text-xs text-muted-foreground">
                            <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                            <span>All devices include lease, setup support, maintenance, and integration with AI Guardian</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p>Device pricing is monthly lease cost. No purchase required. Includes shipping, setup, 24/7 tech support, and automatic replacement if needed.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
