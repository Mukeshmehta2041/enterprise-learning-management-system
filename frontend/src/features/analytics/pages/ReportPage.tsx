import { useExportJobs, useTriggerExport } from '../api/reportHooks';
import type { ExportJob } from '../api/reportHooks';
import { Card, PageHeader, Container, Button, Heading4, TextMuted, Badge } from '@/shared/ui';
import { FileText, Download, Clock, AlertCircle, RefreshCw } from 'lucide-react';
import { cn } from '@/shared/utils/cn';

export function ReportPage() {
  const { data: jobs, isLoading, refetch } = useExportJobs();
  const triggerExport = useTriggerExport();

  const handleExport = (type: string) => {
    triggerExport.mutate(type);
  };

  const handleDownload = (url?: string) => {
    if (!url) return;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const getStatusBadge = (status: ExportJob['status']) => {
    switch (status) {
      case 'COMPLETED':
        return <Badge variant="success">Completed</Badge>;
      case 'PROCESSING':
        return <Badge variant="warning"><RefreshCw className="h-3 w-3 mr-1 animate-spin" /> Processing</Badge>;
      case 'PENDING':
        return <Badge variant="secondary">Pending</Badge>;
      case 'FAILED':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return null;
    }
  };

  return (
    <Container className="py-8">
      <PageHeader
        title="Reports & Exports"
        description="Generate and download detailed system-wide reports."
      />

      <div className="grid md:grid-cols-2 gap-6 mb-12">
        <Card className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-indigo-50 rounded-lg">
              <FileText className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="flex-1">
              <Heading4>Course Overview</Heading4>
              <TextMuted className="text-sm mt-1">
                A comprehensive report of all courses, enrollment trends, and completion rates.
              </TextMuted>
              <Button
                className="mt-4"
                size="sm"
                onClick={() => handleExport('COURSE_OVERVIEW')}
                disabled={triggerExport.isPending}
              >
                {triggerExport.isPending ? 'Requesting...' : 'Generate Report'}
              </Button>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-emerald-50 rounded-lg">
              <Clock className="h-6 w-6 text-emerald-600" />
            </div>
            <div className="flex-1">
              <Heading4>Lecture Engagement</Heading4>
              <TextMuted className="text-sm mt-1">
                Detailed metrics on watch time, completion status, and drop-off points per lecture.
              </TextMuted>
              <Button
                className="mt-4"
                variant="secondary"
                size="sm"
                onClick={() => handleExport('LECTURE_ENGAGEMENT')}
                disabled={triggerExport.isPending}
              >
                Generate Report
              </Button>
            </div>
          </div>
        </Card>
      </div>

      <div className="mt-12">
        <div className="flex items-center justify-between mb-6">
          <Heading4>Recent Exports</Heading4>
          <Button variant="ghost" size="sm" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Status
          </Button>
        </div>

        {isLoading ? (
          <div className="animate-pulse space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-slate-100 rounded-lg" />
            ))}
          </div>
        ) : jobs?.length === 0 ? (
          <Card className="p-12 text-center">
            <TextMuted>No recent export requests.</TextMuted>
          </Card>
        ) : (
          <div className="space-y-3">
            {jobs?.map((job) => (
              <Card key={job.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "p-2 rounded-full",
                    job.status === 'COMPLETED' ? "bg-emerald-50 text-emerald-600" :
                      job.status === 'FAILED' ? "bg-rose-50 text-rose-600" : "bg-slate-50 text-slate-600"
                  )}>
                    {job.status === 'FAILED' ? <AlertCircle className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">
                      {job.reportType.replace('_', ' ')}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Requested on {new Date(job.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  {getStatusBadge(job.status)}

                  {job.status === 'COMPLETED' && job.downloadUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      type="button"
                      onClick={() => handleDownload(job.downloadUrl)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  )}

                  {job.status === 'FAILED' && (
                    <div className="text-xs text-rose-600 max-w-xs text-right truncate">
                      {job.errorMessage || 'Unknown error'}
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Container>
  );
}
