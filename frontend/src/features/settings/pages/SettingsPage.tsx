import { useState } from 'react'
import {
  Container,
  Heading1,
  Heading4,
  TextMuted,
  Card,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Switch,
  Button,
  Modal,
} from '@/shared/ui'
import { Bell, Shield, User, Mail, Download, Trash2, ExternalLink, CreditCard } from 'lucide-react'
import { BillingHistory } from '@/features/payments/components/BillingHistory'

export function SettingsPage() {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  // Demo state for toggles
  const [pref, setPref] = useState({
    marketing: false,
    updates: true,
    courseReminders: true,
    analytics: true,
  })

  const togglePref = (key: keyof typeof pref) => {
    setPref((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <Container className="py-8 max-w-4xl">
      <div className="mb-8">
        <Heading1>Settings</Heading1>
        <TextMuted>Manage your account, privacy, and communication preferences</TextMuted>
      </div>

      <Tabs defaultValue="privacy" className="flex flex-col md:flex-row gap-8">
        <TabsList className="flex flex-col h-auto bg-transparent border-0 items-start gap-1 p-0 min-w-[200px]">
          <TabsTrigger
            value="profile"
            className="w-full justify-start data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700 py-2.5 px-3 rounded-lg gap-2"
          >
            <User size={18} />
            Profile
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="w-full justify-start data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700 py-2.5 px-3 rounded-lg gap-2"
          >
            <Bell size={18} />
            Notifications
          </TabsTrigger>
          <TabsTrigger
            value="privacy"
            className="w-full justify-start data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700 py-2.5 px-3 rounded-lg gap-2"
          >
            <Shield size={18} />
            Privacy & Data
          </TabsTrigger>
          <TabsTrigger
            value="billing"
            className="w-full justify-start data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700 py-2.5 px-3 rounded-lg gap-2"
          >
            <CreditCard size={18} />
            Billing & Payments
          </TabsTrigger>
        </TabsList>

        <div className="flex-1">
          <TabsContent value="profile" className="mt-0">
            <Card className="p-6">
              <Heading4 className="mb-4">Profile Information</Heading4>
              <TextMuted>Profile editing is handled in the account overview.</TextMuted>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="mt-0 space-y-6">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <Mail className="text-indigo-600" size={24} />
                <Heading4>Email Preferences</Heading4>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Marketing Emails</p>
                    <p className="text-sm text-slate-500">Receive news about new courses and promotions</p>
                  </div>
                  <Switch
                    checked={pref.marketing}
                    onCheckedChange={() => togglePref('marketing')}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Product Updates</p>
                    <p className="text-sm text-slate-500">Important messages about platform features</p>
                  </div>
                  <Switch
                    checked={pref.updates}
                    onCheckedChange={() => togglePref('updates')}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Course Reminders</p>
                    <p className="text-sm text-slate-500">Stay on track with your learning goals</p>
                  </div>
                  <Switch
                    checked={pref.courseReminders}
                    onCheckedChange={() => togglePref('courseReminders')}
                  />
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="privacy" className="mt-0 space-y-6">
            <Card className="p-6">
              <Heading4 className="mb-6 flex items-center gap-2">
                <Shield size={20} className="text-indigo-600" />
                Data & Privacy
              </Heading4>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Analytics Tracking</p>
                    <p className="text-sm text-slate-500">Allow us to collect data to improve your experience</p>
                  </div>
                  <Switch
                    checked={pref.analytics}
                    onCheckedChange={() => togglePref('analytics')}
                  />
                </div>

                <div className="pt-6 border-t border-slate-100">
                  <p className="font-medium mb-1 text-slate-900">Privacy Policy</p>
                  <p className="text-sm text-slate-500 mb-4">
                    Review our detailed privacy policy to understand how we handle your data.
                  </p>
                  <Button variant="outline" className="gap-2" onClick={() => window.open('/privacy-policy')}>
                    View Privacy Policy <ExternalLink size={14} />
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-rose-100">
              <Heading4 className="mb-4 text-rose-900">Personal Data Actions</Heading4>
              <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-lg flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-900">Download My Data</p>
                    <p className="text-sm text-slate-500">Request a copy of all your personal data in JSON format</p>
                  </div>
                  <Button variant="outline" size="sm" className="gap-2" onClick={() => setIsExportModalOpen(true)}>
                    <Download size={16} /> Request
                  </Button>
                </div>

                <div className="p-4 bg-rose-50 rounded-lg flex items-center justify-between">
                  <div>
                    <p className="font-medium text-rose-900">Delete Account</p>
                    <p className="text-sm text-rose-700">Permanently delete your account and all associated data</p>
                  </div>
                  <Button variant="destructive" size="sm" className="gap-2" onClick={() => setIsDeleteModalOpen(true)}>
                    <Trash2 size={16} /> Delete
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="billing" className="mt-0">
            <BillingHistory />
          </TabsContent>
        </div>
      </Tabs>

      {/* Modals */}
      <Modal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        title="Request Data Export"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsExportModalOpen(false)}>Cancel</Button>
            <Button onClick={() => setIsExportModalOpen(false)}>Confirm Request</Button>
          </>
        }
      >
        <p className="text-slate-600 mb-4">
          We will compile all your information including profile data, enrollment history, and course progress into a machine-readable format.
        </p>
        <p className="text-sm p-3 bg-amber-50 text-amber-800 rounded-lg border border-amber-100">
          <strong>Note:</strong> This process may take up to 48 hours. You will receive an email once your download is ready.
        </p>
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Your Account"
        className="max-w-md"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={() => setIsDeleteModalOpen(false)}>Yes, Delete Forever</Button>
          </>
        }
      >
        <p className="text-slate-600 mb-4">
          Are you sure you want to delete your account? This action is <strong>permanent</strong> and cannot be undone.
        </p>
        <ul className="list-disc list-inside text-sm text-slate-500 space-y-1">
          <li>All course progress will be lost</li>
          <li>You will lose access to all purchased courses</li>
          <li>Your profile and reviews will be removed</li>
        </ul>
      </Modal>
    </Container>
  )
}
