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
  Input,
} from '@/shared/ui'
import {
  Bell,
  Shield,
  User,
  Download,
  Trash2,
  ExternalLink,
  CreditCard,
  Save,
} from 'lucide-react'
import { BillingHistory } from '@/features/payments/components/BillingHistory'
import { useToast } from '@/shared/context/ToastContext'

export function SettingsPage() {
  const { success } = useToast()

  const [isExportModalOpen, setIsExportModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const [user, setUser] = useState({
    name: 'Mukesh Kumar',
    email: 'mukesh@example.com',
    title: 'Senior Software Engineer',
  })

  const [pref, setPref] = useState({
    marketing: false,
    updates: true,
    courseReminders: true,
    analytics: true,
  })

  const togglePref = (key: keyof typeof pref) => {
    setPref((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const handleSaveSettings = () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      success('Settings saved successfully')
    }, 1000)
  }

  return (
    <Container size="lg" className="py-8">
      <div className="mb-8">
        <Heading1>Settings</Heading1>
        <TextMuted>
          Manage your account, privacy, and communication preferences
        </TextMuted>
      </div>

      <Tabs defaultValue="profile" className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <TabsList className="flex flex-col w-full md:w-64 p-0 bg-transparent">
          <TabsTrigger value="profile" className="justify-start gap-2">
            <User size={18} /> Profile
          </TabsTrigger>
          <TabsTrigger value="notifications" className="justify-start gap-2">
            <Bell size={18} /> Notifications
          </TabsTrigger>
          <TabsTrigger value="privacy" className="justify-start gap-2">
            <Shield size={18} /> Privacy & Data
          </TabsTrigger>
          <TabsTrigger value="billing" className="justify-start gap-2">
            <CreditCard size={18} /> Billing
          </TabsTrigger>
        </TabsList>

        {/* Content */}
        <div className="flex-1">
          {/* PROFILE */}
          <TabsContent value="profile">
            <Card className="p-6">
              <Heading4 className="mb-6">Profile Information</Heading4>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <Input
                  label="Full Name"
                  value={user.name}
                  onChange={(e) =>
                    setUser({ ...user, name: e.target.value })
                  }
                />
                <Input
                  label="Email"
                  type="email"
                  value={user.email}
                  onChange={(e) =>
                    setUser({ ...user, email: e.target.value })
                  }
                />
              </div>

              <Input
                label="Professional Title"
                value={user.title}
                onChange={(e) =>
                  setUser({ ...user, title: e.target.value })
                }
              />

              <div className="flex justify-end pt-4 border-t mt-6">
                <Button onClick={handleSaveSettings} disabled={isSaving}>
                  <Save size={16} />
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </Card>
          </TabsContent>

          {/* NOTIFICATIONS */}
          <TabsContent value="notifications">
            <Card className="p-6 space-y-6">
              <Heading4>Email Preferences</Heading4>

              {[
                ['Marketing Emails', 'marketing'],
                ['Product Updates', 'updates'],
                ['Course Reminders', 'courseReminders'],
              ].map(([label, key]) => (
                <div
                  key={key}
                  className="flex items-center justify-between"
                >
                  <p className="font-medium">{label}</p>
                  <Switch
                    checked={pref[key as keyof typeof pref]}
                    onCheckedChange={() =>
                      togglePref(key as keyof typeof pref)
                    }
                  />
                </div>
              ))}

              <div className="flex justify-end pt-4 border-t">
                <Button onClick={handleSaveSettings}>
                  <Save size={16} /> Save Changes
                </Button>
              </div>
            </Card>
          </TabsContent>

          {/* PRIVACY */}
          <TabsContent value="privacy">
            <Card className="p-6 space-y-6">
              <Heading4>Privacy & Data</Heading4>

              <div className="flex justify-between">
                <p>Analytics Tracking</p>
                <Switch
                  checked={pref.analytics}
                  onCheckedChange={() => togglePref('analytics')}
                />
              </div>

              <Button
                variant="outline"
                onClick={() => window.open('/privacy-policy')}
              >
                View Privacy Policy <ExternalLink size={14} />
              </Button>

              <div className="border-t pt-6 space-y-4">
                <Button
                  variant="outline"
                  onClick={() => setIsExportModalOpen(true)}
                >
                  <Download size={16} /> Download My Data
                </Button>

                <Button
                  variant="destructive"
                  onClick={() => setIsDeleteModalOpen(true)}
                >
                  <Trash2 size={16} /> Delete Account
                </Button>
              </div>
            </Card>
          </TabsContent>

          {/* BILLING */}
          <TabsContent value="billing">
            <BillingHistory />
          </TabsContent>
        </div>
      </Tabs>

      {/* EXPORT MODAL */}
      <Modal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        title="Request Data Export"
      >
        <p className="text-slate-600">
          Your data will be prepared and emailed within 24–48 hours.
        </p>
      </Modal>

      {/* DELETE MODAL */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Account"
      >
        <p className="text-rose-700">
          This action is permanent and cannot be undone.
        </p>
      </Modal>
    </Container>
  )
}
