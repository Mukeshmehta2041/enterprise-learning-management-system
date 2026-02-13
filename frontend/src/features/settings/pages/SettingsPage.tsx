import { useMemo, useState } from 'react'
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
  Checkbox,
  Badge,
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
  KeyRound,
  Plus,
  Copy,
} from 'lucide-react'
import { BillingHistory } from '@/features/payments/components/BillingHistory'
import { useToast } from '@/shared/context/ToastContext'
import { useNotificationPreferences, useUpsertNotificationPreference } from '@/features/notifications/api/useNotificationPreferences'
import type { NotificationChannel, NotificationEventType } from '@/shared/types/notification'
import { useAccess } from '@/shared/hooks/useAccess'
import { useApiKeys, useCreateApiKey, useRevokeApiKey, type ApiKeyCreateResponse } from '@/features/settings/api/apiKeys'

export function SettingsPage() {
  const { success } = useToast()
  const { hasRole } = useAccess()

  const [isExportModalOpen, setIsExportModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [apiKeyName, setApiKeyName] = useState('')
  const [apiKeyScopes, setApiKeyScopes] = useState<string[]>([])
  const [createdKey, setCreatedKey] = useState<ApiKeyCreateResponse | null>(null)

  const [user, setUser] = useState({
    name: 'Mukesh Kumar',
    email: 'mukesh@example.com',
    title: 'Senior Software Engineer',
  })

  const [analyticsEnabled, setAnalyticsEnabled] = useState(true)

  const showDeveloperTab = hasRole(['INSTRUCTOR', 'ADMIN'])
  const { data: apiKeys, isLoading: isApiKeysLoading } = useApiKeys(showDeveloperTab)
  const createApiKey = useCreateApiKey()
  const revokeApiKey = useRevokeApiKey()

  const { data: notificationPreferences, isLoading: isNotificationPrefsLoading } = useNotificationPreferences()
  const upsertPreference = useUpsertNotificationPreference()

  const preferenceMap = useMemo(() => {
    const map = new Map<string, boolean>()
    notificationPreferences?.forEach((pref) => {
      const courseId = pref.courseId || 'global'
      map.set(`${courseId}:${pref.eventType}:${pref.channel}`, pref.enabled)
    })
    return map
  }, [notificationPreferences])

  const isPreferenceEnabled = (eventType: NotificationEventType, channel: NotificationChannel) => {
    const key = `global:${eventType}:${channel}`
    return preferenceMap.has(key) ? preferenceMap.get(key) : true
  }

  const handleTogglePreference = (eventType: NotificationEventType, channel: NotificationChannel) => {
    const current = isPreferenceEnabled(eventType, channel)
    upsertPreference.mutate({
      courseId: null,
      eventType,
      channel,
      enabled: !current,
    })
  }

  const handleSaveSettings = () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      success('Settings saved successfully')
    }, 1000)
  }

  const availableScopes = [
    { value: 'courses:read', label: 'Read course catalog' },
    { value: 'enrollments:write', label: 'Create enrollments' },
    { value: 'analytics:read', label: 'Read analytics exports' },
  ]

  const toggleScope = (scope: string) => {
    setApiKeyScopes((prev) =>
      prev.includes(scope) ? prev.filter((item) => item !== scope) : [...prev, scope]
    )
  }

  const handleCreateApiKey = () => {
    createApiKey.mutate(
      {
        name: apiKeyName.trim(),
        scopes: apiKeyScopes,
      },
      {
        onSuccess: (data) => {
          setCreatedKey(data)
        },
      }
    )
  }

  const resetApiKeyModal = () => {
    setIsApiKeyModalOpen(false)
    setApiKeyName('')
    setApiKeyScopes([])
    setCreatedKey(null)
  }

  const preferenceGroups: {
    title: string
    channel: NotificationChannel
    items: { label: string; description: string; eventType: NotificationEventType }[]
  }[] = [
      {
        title: 'In-app Alerts',
        channel: 'IN_APP',
        items: [
          {
            label: 'New lessons published',
            description: 'Get notified when new lessons unlock in your enrolled courses.',
            eventType: 'LessonPublished',
          },
          {
            label: 'Lesson updates',
            description: 'Get notified when lesson content is updated.',
            eventType: 'LessonUpdated',
          },
          {
            label: 'New assignments posted',
            description: 'Stay ahead when instructors post new assignments.',
            eventType: 'AssignmentCreated',
          },
          {
            label: 'Assignment updates',
            description: 'Get notified when assignment details or deadlines change.',
            eventType: 'AssignmentUpdated',
          },
          {
            label: 'Upcoming deadlines',
            description: 'Reminders for assignments due within 24 hours.',
            eventType: 'AssignmentDueSoon',
          },
          {
            label: 'Assignment graded',
            description: 'Know right away when your submission is graded.',
            eventType: 'AssignmentGraded',
          },
        ],
      },
      {
        title: 'Email Alerts',
        channel: 'EMAIL',
        items: [
          {
            label: 'Lesson announcements',
            description: 'Receive an email when a lesson is published.',
            eventType: 'LessonPublished',
          },
          {
            label: 'Lesson update alerts',
            description: 'Receive an email when lesson content is updated.',
            eventType: 'LessonUpdated',
          },
          {
            label: 'Assignment alerts',
            description: 'Receive an email when new assignments are posted or updated.',
            eventType: 'AssignmentCreated',
          },
          {
            label: 'Deadline reminders',
            description: 'Receive an email for upcoming assignment deadlines.',
            eventType: 'AssignmentDueSoon',
          },
          {
            label: 'Grade updates',
            description: 'Receive an email when your assignment is graded.',
            eventType: 'AssignmentGraded',
          },
        ],
      },
    ]

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
          {showDeveloperTab && (
            <TabsTrigger value="developer" className="justify-start gap-2">
              <KeyRound size={18} /> Developer
            </TabsTrigger>
          )}
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
            <Card className="p-6 space-y-8">
              {preferenceGroups.map((group) => (
                <div key={group.title} className="space-y-4">
                  <Heading4>{group.title}</Heading4>
                  {group.items.map((item) => {
                    const enabled = isPreferenceEnabled(item.eventType, group.channel)
                    return (
                      <div key={item.eventType} className="flex items-center justify-between gap-4">
                        <div>
                          <p className="font-medium">{item.label}</p>
                          <TextMuted className="text-sm">{item.description}</TextMuted>
                        </div>
                        <Switch
                          checked={enabled}
                          disabled={isNotificationPrefsLoading || upsertPreference.isPending}
                          onCheckedChange={() => handleTogglePreference(item.eventType, group.channel)}
                        />
                      </div>
                    )
                  })}
                </div>
              ))}

              <div className="flex items-center justify-between pt-4 border-t">
                <TextMuted className="text-sm">
                  Changes are saved automatically.
                </TextMuted>
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
                  checked={analyticsEnabled}
                  onCheckedChange={() => setAnalyticsEnabled((prev) => !prev)}
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

          {/* DEVELOPER */}
          {showDeveloperTab && (
            <TabsContent value="developer">
              <Card className="p-6 space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <Heading4>API Keys</Heading4>
                    <TextMuted className="text-sm">
                      Create and manage keys for partner integrations and server-to-server access.
                    </TextMuted>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      onClick={() => window.open('/swagger-ui.html', '_blank')}
                    >
                      <ExternalLink size={16} /> API Docs
                    </Button>
                    <Button onClick={() => setIsApiKeyModalOpen(true)}>
                      <Plus size={16} /> Create Key
                    </Button>
                  </div>
                </div>

                {isApiKeysLoading && (
                  <TextMuted>Loading API keys...</TextMuted>
                )}

                {!isApiKeysLoading && (!apiKeys || apiKeys.length === 0) && (
                  <TextMuted>No API keys created yet.</TextMuted>
                )}

                {apiKeys?.map((key) => (
                  <div key={key.id} className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="font-medium text-slate-900">{key.name}</p>
                        <TextMuted className="text-xs">
                          Created {new Date(key.createdAt).toLocaleString()}
                        </TextMuted>
                        {key.lastUsedAt && (
                          <TextMuted className="text-xs">
                            Last used {new Date(key.lastUsedAt).toLocaleString()}
                          </TextMuted>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={key.enabled ? 'success' : 'error'}>
                          {key.enabled ? 'Active' : 'Revoked'}
                        </Badge>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            if (window.confirm('Revoke this API key? This cannot be undone.')) {
                              revokeApiKey.mutate(key.id)
                            }
                          }}
                        >
                          Revoke
                        </Button>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {key.scopes.map((scope) => (
                        <Badge key={scope} variant="secondary">
                          {scope}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </Card>
            </TabsContent>
          )}

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

      {/* API KEY MODAL */}
      <Modal
        isOpen={isApiKeyModalOpen}
        onClose={resetApiKeyModal}
        title="Create API Key"
      >
        {createdKey ? (
          <div className="space-y-4">
            <TextMuted className="text-sm">
              Copy this key now. You will not be able to view it again.
            </TextMuted>
            <Input
              label="API Key"
              value={createdKey.rawKey}
              readOnly
            />
            <div className="flex flex-wrap justify-end gap-2">
              <Button
                variant="outline"
                onClick={async () => {
                  await navigator.clipboard.writeText(createdKey.rawKey)
                  success('API key copied to clipboard')
                }}
              >
                <Copy size={16} /> Copy
              </Button>
              <Button onClick={resetApiKeyModal}>Done</Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Input
              label="Key Name"
              value={apiKeyName}
              onChange={(event) => setApiKeyName(event.target.value)}
              placeholder="Partner integration"
            />

            <div className="space-y-3">
              <Heading4>Scopes</Heading4>
              {availableScopes.map((scope) => (
                <Checkbox
                  key={scope.value}
                  label={scope.label}
                  checked={apiKeyScopes.includes(scope.value)}
                  onChange={() => toggleScope(scope.value)}
                />
              ))}
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={resetApiKeyModal}>
                Cancel
              </Button>
              <Button
                onClick={handleCreateApiKey}
                isLoading={createApiKey.isPending}
                disabled={!apiKeyName.trim() || apiKeyScopes.length === 0}
              >
                <KeyRound size={16} /> Generate Key
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </Container>
  )
}
