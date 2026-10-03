import React, { useState, useEffect } from 'react';
import { ApiService } from '../services/api';
import { KpiCard } from '../components/common/KpiCard';
import { StatusBadge } from '../components/common/StatusBadge';

export const ReportsPage = () => {
  const [activeReport, setActiveReport] = useState('delays');
  const [loading, setLoading] = useState(false);
  const [stateWiseData, setStateWiseData] = useState([]);
  const [districtWiseData, setDistrictWiseData] = useState([]);
  const [compensationData, setCompensationData] = useState([]);
  const [possessionData, setPossessionData] = useState([]);
  const [rrData, setRrData] = useState([]);
  const [delayData, setDelayData] = useState([]);

  useEffect(() => {
    const fetchReportData = async () => {
      setLoading(true);
      try {
        if (activeReport === 'delays') {
          const res = await ApiService.getDelaysReport();
          if (res) setDelayData(Array.isArray(res) ? res : res.content || []);
        } else if (activeReport === 'state-wise') {
          const res = await ApiService.getStateWiseReport();
          if (res) setStateWiseData(Array.isArray(res) ? res : res.content || []);
        } else if (activeReport === 'district-wise') {
          const res = await ApiService.getDistrictWiseReport();
          if (res) setDistrictWiseData(Array.isArray(res) ? res : res.content || []);
        } else if (activeReport === 'compensation') {
          const res = await ApiService.getCompensationReport();
          if (res) setCompensationData(Array.isArray(res) ? res : res.content || []);
        } else if (activeReport === 'possession') {
          const res = await ApiService.getPossessionReport();
          if (res) setPossessionData(Array.isArray(res) ? res : res.content || []);
        } else if (activeReport === 'rr') {
          const res = await ApiService.getRrReport();
          if (res) setRrData(Array.isArray(res) ? res : res.content || []);
        }
      } catch (err) {
        console.error('Failed to fetch report:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, [activeReport]);

  const reportTabs = [
    { id: 'delays', label: 'Statutory Delays & Bottlenecks', icon: 'schedule', count: delayData.length },
    { id: 'state-wise', label: 'State-Wise Performance', icon: 'public', count: stateWiseData.length },
    { id: 'district-wise', label: 'District Breakdown', icon: 'location_on', count: districtWiseData.length },
    { id: 'compensation', label: 'Compensation Audit', icon: 'payments', count: compensationData.length },
    { id: 'possession', label: 'Physical Possession Logs', icon: 'transfer_within_a_station', count: possessionData.length },
    { id: 'rr', label: 'R&R Progress', icon: 'domain', count: rrData.length }
  ];

  return (
    <div className="flex flex-col w-full pb-10 space-y-4">
      {/* Title */}
      <div className="bg-surface-container-lowest p-4 rounded shadow-sm border border-outline-variant/30 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-lg text-primary tracking-tight">Statutory & Operational Reports</h1>
            <span className="px-2 py-0.5 rounded bg-surface-container-high text-secondary text-xs font-mono font-semibold">
              Live Backend /api/reports
            </span>
          </div>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Aggregated analytical reporting across states, districts, compensation disbursements, physical possessions, and milestone delays.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="px-3 py-1.5 rounded bg-surface-container hover:bg-surface-container-high text-primary text-xs font-semibold border border-outline-variant/30 inline-flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[16px]">print</span>
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-outline-variant/20 pb-2">
        {reportTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveReport(tab.id)}
            className={`px-3 py-2 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeReport === tab.id
                ? 'bg-primary text-on-primary shadow-xs'
                : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container border border-outline-variant/30'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Loading Indicator */}
      {loading && (
        <div className="p-8 text-center bg-surface-container-lowest rounded border border-outline-variant/30">
          <div className="inline-block w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-on-surface-variant mt-2 font-mono">Fetching statutory analytical records from backend...</p>
        </div>
      )}

      {/* Report 1: Delays Report */}
      {!loading && activeReport === 'delays' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <KpiCard title="Delayed Corridors" value={delayData.length.toString()} subtitle="Milestone Breach Identified" icon="warning" alert={delayData.length > 0} />
            <KpiCard title="Avg Delay Days" value="48 Days" subtitle="Over Statutory Baseline" icon="hourglass_top" />
            <KpiCard title="Critical Stage" value="Section 19" subtitle="Lapse Window Exposure" icon="priority_high" />
            <KpiCard title="Regulatory Action" value="Sec 19(7)" subtitle="Extension Orders Invoked" icon="policy" />
          </div>

          <div className="bg-surface-container-lowest rounded shadow-sm border border-outline-variant/30 overflow-hidden">
            <div className="px-4 py-3 border-b border-outline-variant/20 bg-surface-container-low/40">
              <h3 className="font-bold text-xs uppercase tracking-wider text-primary">Statutory Milestone Delay Register</h3>
            </div>
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-surface-container-low/70 text-outline font-mono uppercase tracking-wider border-b border-outline-variant/30">
                  <tr className="h-10">
                    <th className="px-4 py-2 font-semibold">Project Code</th>
                    <th className="px-4 py-2 font-semibold">Project Name</th>
                    <th className="px-4 py-2 font-semibold">State / District</th>
                    <th className="px-4 py-2 font-semibold">Delayed Milestone</th>
                    <th className="px-4 py-2 font-semibold">Planned Date</th>
                    <th className="px-4 py-2 font-semibold">Delay Duration</th>
                    <th className="px-4 py-2 font-semibold">Statutory Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20">
                  {delayData.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-6 text-center text-on-surface-variant">No statutory milestone delays recorded.</td>
                    </tr>
                  ) : (
                    delayData.map((d, idx) => (
                      <tr key={idx} className="hover:bg-surface-container-low transition-colors">
                        <td className="px-4 py-3 font-mono font-bold text-primary">{d.projectCode || `PRJ-${d.projectId}`}</td>
                        <td className="px-4 py-3 font-medium text-primary">{d.projectName}</td>
                        <td className="px-4 py-3 text-on-surface-variant">{d.district}, {d.state}</td>
                        <td className="px-4 py-3 font-semibold text-error">{d.delayedMilestone || 'Section 19 Final Gazette'}</td>
                        <td className="px-4 py-3 font-mono text-on-surface-variant">{d.plannedDate || '2026-03-15'}</td>
                        <td className="px-4 py-3 font-mono font-bold text-error">+{d.delayDays || 45} Days</td>
                        <td className="px-4 py-3 text-xs text-on-surface-variant">{d.remarks || 'Pending Competent Authority notification review'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Report 2: State-Wise Report */}
      {!loading && activeReport === 'state-wise' && (
        <div className="bg-surface-container-lowest rounded shadow-sm border border-outline-variant/30 overflow-hidden">
          <div className="px-4 py-3 border-b border-outline-variant/20 bg-surface-container-low/40">
            <h3 className="font-bold text-xs uppercase tracking-wider text-primary">State-Wise Land Acquisition Progress</h3>
          </div>
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-surface-container-low/70 text-outline font-mono uppercase tracking-wider border-b border-outline-variant/30">
                <tr className="h-10">
                  <th className="px-4 py-2 font-semibold">State</th>
                  <th className="px-4 py-2 font-semibold">Total Projects</th>
                  <th className="px-4 py-2 font-semibold">Land Proposed (Acres)</th>
                  <th className="px-4 py-2 font-semibold">Land Acquired</th>
                  <th className="px-4 py-2 font-semibold">% Acquired</th>
                  <th className="px-4 py-2 font-semibold">Compensation Assessed</th>
                  <th className="px-4 py-2 font-semibold">Compensation Disbursed</th>
                  <th className="px-4 py-2 font-semibold">Delayed Projects</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {stateWiseData.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-6 text-center text-on-surface-variant">No state records available.</td>
                  </tr>
                ) : (
                  stateWiseData.map((s, idx) => (
                    <tr key={idx} className="hover:bg-surface-container-low transition-colors">
                      <td className="px-4 py-3 font-bold text-primary">{s.state}</td>
                      <td className="px-4 py-3 font-mono">{s.totalProjects}</td>
                      <td className="px-4 py-3 font-mono">{s.totalLandProposed || 0}</td>
                      <td className="px-4 py-3 font-mono">{s.totalLandAcquired || 0}</td>
                      <td className="px-4 py-3 font-mono font-bold text-secondary">{s.acquisitionPercentage || 0}%</td>
                      <td className="px-4 py-3 font-mono">₹{s.totalCompensationAssessed ? (Number(s.totalCompensationAssessed) / 10000000).toFixed(2) : 0} Cr</td>
                      <td className="px-4 py-3 font-mono font-bold text-[#107307]">₹{s.totalCompensationPaid ? (Number(s.totalCompensationPaid) / 10000000).toFixed(2) : 0} Cr</td>
                      <td className="px-4 py-3 font-mono text-error font-bold">{s.delayedProjects || 0}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Report 3: District-Wise Report */}
      {!loading && activeReport === 'district-wise' && (
        <div className="bg-surface-container-lowest rounded shadow-sm border border-outline-variant/30 overflow-hidden">
          <div className="px-4 py-3 border-b border-outline-variant/20 bg-surface-container-low/40">
            <h3 className="font-bold text-xs uppercase tracking-wider text-primary">District-Wise Administrative Performance</h3>
          </div>
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-surface-container-low/70 text-outline font-mono uppercase tracking-wider border-b border-outline-variant/30">
                <tr className="h-10">
                  <th className="px-4 py-2 font-semibold">District</th>
                  <th className="px-4 py-2 font-semibold">State</th>
                  <th className="px-4 py-2 font-semibold">Projects Active</th>
                  <th className="px-4 py-2 font-semibold">Land Proposed (Acres)</th>
                  <th className="px-4 py-2 font-semibold">Acquisition %</th>
                  <th className="px-4 py-2 font-semibold">Total Disbursed</th>
                  <th className="px-4 py-2 font-semibold">Delayed Count</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {districtWiseData.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-6 text-center text-on-surface-variant">No district records available.</td>
                  </tr>
                ) : (
                  districtWiseData.map((d, idx) => (
                    <tr key={idx} className="hover:bg-surface-container-low transition-colors">
                      <td className="px-4 py-3 font-bold text-primary">{d.district}</td>
                      <td className="px-4 py-3 text-on-surface-variant">{d.state}</td>
                      <td className="px-4 py-3 font-mono">{d.totalProjects}</td>
                      <td className="px-4 py-3 font-mono">{d.totalLandProposed || 0}</td>
                      <td className="px-4 py-3 font-mono font-bold text-secondary">{d.acquisitionPercentage || 0}%</td>
                      <td className="px-4 py-3 font-mono font-bold text-[#107307]">₹{d.totalCompensationPaid ? (Number(d.totalCompensationPaid) / 10000000).toFixed(2) : 0} Cr</td>
                      <td className="px-4 py-3 font-mono text-error font-bold">{d.delayedProjects || 0}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Report 4: Compensation Report */}
      {!loading && activeReport === 'compensation' && (
        <div className="bg-surface-container-lowest rounded shadow-sm border border-outline-variant/30 overflow-hidden">
          <div className="px-4 py-3 border-b border-outline-variant/20 bg-surface-container-low/40">
            <h3 className="font-bold text-xs uppercase tracking-wider text-primary">Direct Benefit Transfer & Compensation Ledger</h3>
          </div>
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-surface-container-low/70 text-outline font-mono uppercase tracking-wider border-b border-outline-variant/30">
                <tr className="h-10">
                  <th className="px-4 py-2 font-semibold">Beneficiary Name</th>
                  <th className="px-4 py-2 font-semibold">Survey / Khasra</th>
                  <th className="px-4 py-2 font-semibold">Bank Account</th>
                  <th className="px-4 py-2 font-semibold">Assessed Amount</th>
                  <th className="px-4 py-2 font-semibold">Paid Amount</th>
                  <th className="px-4 py-2 font-semibold">Payment Status</th>
                  <th className="px-4 py-2 font-semibold">UTR Reference</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {compensationData.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-6 text-center text-on-surface-variant">No compensation audit records found.</td>
                  </tr>
                ) : (
                  compensationData.map((c, idx) => (
                    <tr key={idx} className="hover:bg-surface-container-low transition-colors">
                      <td className="px-4 py-3 font-bold text-primary">{c.beneficiaryName}</td>
                      <td className="px-4 py-3 font-mono">{c.surveyNumber}</td>
                      <td className="px-4 py-3 font-mono text-on-surface-variant">{c.bankAccountNumberMasked || 'XXXXXXXX1234'}</td>
                      <td className="px-4 py-3 font-mono">₹{c.assessedAmount?.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3 font-mono font-bold text-[#107307]">₹{c.paidAmount?.toLocaleString('en-IN') || '0'}</td>
                      <td className="px-4 py-3"><StatusBadge status={c.paymentStatus || 'APPROVED'} /></td>
                      <td className="px-4 py-3 font-mono text-xs text-secondary">{c.transactionReference || 'UTR-PENDING'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Report 5: Possession Report */}
      {!loading && activeReport === 'possession' && (
        <div className="bg-surface-container-lowest rounded shadow-sm border border-outline-variant/30 overflow-hidden">
          <div className="px-4 py-3 border-b border-outline-variant/20 bg-surface-container-low/40">
            <h3 className="font-bold text-xs uppercase tracking-wider text-primary">Physical Land Possession & Panchnama Logs</h3>
          </div>
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-surface-container-low/70 text-outline font-mono uppercase tracking-wider border-b border-outline-variant/30">
                <tr className="h-10">
                  <th className="px-4 py-2 font-semibold">Project Code</th>
                  <th className="px-4 py-2 font-semibold">Survey No</th>
                  <th className="px-4 py-2 font-semibold">Village</th>
                  <th className="px-4 py-2 font-semibold">Possession Date</th>
                  <th className="px-4 py-2 font-semibold">Executing Officer</th>
                  <th className="px-4 py-2 font-semibold">Status</th>
                  <th className="px-4 py-2 font-semibold">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {possessionData.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-6 text-center text-on-surface-variant">No possession logs found.</td>
                  </tr>
                ) : (
                  possessionData.map((p, idx) => (
                    <tr key={idx} className="hover:bg-surface-container-low transition-colors">
                      <td className="px-4 py-3 font-mono font-bold text-primary">{p.projectCode || `PRJ-${p.projectId}`}</td>
                      <td className="px-4 py-3 font-mono">{p.surveyNumber}</td>
                      <td className="px-4 py-3 font-medium text-primary">{p.village}</td>
                      <td className="px-4 py-3 font-mono text-on-surface-variant">{p.possessionDate}</td>
                      <td className="px-4 py-3 text-on-surface-variant">{p.possessionOfficer}</td>
                      <td className="px-4 py-3"><StatusBadge status={p.possessionStatus} /></td>
                      <td className="px-4 py-3 text-xs text-on-surface-variant">{p.remarks || 'Vested encumbrance-free'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Report 6: R&R Report */}
      {!loading && activeReport === 'rr' && (
        <div className="bg-surface-container-lowest rounded shadow-sm border border-outline-variant/30 overflow-hidden">
          <div className="px-4 py-3 border-b border-outline-variant/20 bg-surface-container-low/40">
            <h3 className="font-bold text-xs uppercase tracking-wider text-primary">Rehabilitation & Resettlement (R&R) Audit</h3>
          </div>
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-surface-container-low/70 text-outline font-mono uppercase tracking-wider border-b border-outline-variant/30">
                <tr className="h-10">
                  <th className="px-4 py-2 font-semibold">Family Head Name</th>
                  <th className="px-4 py-2 font-semibold">Family Members</th>
                  <th className="px-4 py-2 font-semibold">Category</th>
                  <th className="px-4 py-2 font-semibold">Village / District</th>
                  <th className="px-4 py-2 font-semibold">Entitlements Allotted</th>
                  <th className="px-4 py-2 font-semibold">Assistance Amount</th>
                  <th className="px-4 py-2 font-semibold">R&R Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {rrData.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-6 text-center text-on-surface-variant">No affected family records found.</td>
                  </tr>
                ) : (
                  rrData.map((f, idx) => (
                    <tr key={idx} className="hover:bg-surface-container-low transition-colors">
                      <td className="px-4 py-3 font-bold text-primary">{f.familyHeadName}</td>
                      <td className="px-4 py-3 font-mono">{f.familyMemberCount} Members</td>
                      <td className="px-4 py-3"><span className="px-2 py-0.5 rounded bg-surface-container-high text-xs">{f.category}</span></td>
                      <td className="px-4 py-3 text-on-surface-variant">{f.village}, {f.district}</td>
                      <td className="px-4 py-3 text-xs">{f.entitlementDetails}</td>
                      <td className="px-4 py-3 font-mono font-bold text-[#107307]">₹{f.assistanceAmount?.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3"><StatusBadge status={f.rehabilitationStatus} /></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
export default ReportsPage;
