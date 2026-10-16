import React from 'react';
import { Sheet } from '../ui/Sheet';
import { Ruler, CheckCircle2 } from 'lucide-react';

interface SizeGuideDrawerProps {
  open: boolean;
  onClose: () => void;
}

export const SizeGuideDrawer: React.FC<SizeGuideDrawerProps> = ({ open, onClose }) => {
  const sizeChart = [
    { uk: 6, eu: 40, us: 7, cm: '24.5' },
    { uk: 7, eu: 41, us: 8, cm: '25.4' },
    { uk: 8, eu: 42, us: 9, cm: '26.2' },
    { uk: 9, eu: 43, us: 10, cm: '27.1' },
    { uk: 10, eu: 44, us: 11, cm: '27.9' },
    { uk: 11, eu: 45, us: 12, cm: '28.8' },
  ];

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title="Footwear Sizing Chart"
      description="Demo size chart calibrated for Indian feet"
    >
      <div className="space-y-6">
        {/* Banner */}
        <div className="p-3.5 rounded-panel bg-white/[0.03] border border-line flex items-start gap-3">
          <Ruler className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
          <div className="text-small">
            <p className="font-display font-medium text-text">Standard UK / India Sizing</p>
            <p className="text-text-3 text-[12px] mt-0.5">
              Indian footwear brands use standard UK measurements. If you usually wear UK 8 in sneakers, order UK 8 unless noted in the fit scale.
            </p>
          </div>
        </div>

        {/* Size Chart Table */}
        <div className="border border-line rounded-panel overflow-hidden">
          <div className="px-4 py-2.5 bg-bg border-b border-line flex items-center justify-between text-[11px] font-mono uppercase text-text-3">
            <span>Size Conversion Table</span>
            <span className="text-text-3/70">Demo Calibration</span>
          </div>

          <table className="w-full text-small">
            <thead className="bg-bg-sunken text-left text-text-3 font-mono text-[11px] border-b border-line">
              <tr>
                <th className="py-2.5 px-4 font-normal">UK / India</th>
                <th className="py-2.5 px-4 font-normal">EU</th>
                <th className="py-2.5 px-4 font-normal">US Mens</th>
                <th className="py-2.5 px-4 font-normal">Foot Length (cm)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line text-text">
              {sizeChart.map(row => (
                <tr key={row.uk} className="hover:bg-white/[0.02]">
                  <td className="py-2.5 px-4 font-mono font-medium text-text">UK {row.uk}</td>
                  <td className="py-2.5 px-4 font-mono text-text-2">{row.eu}</td>
                  <td className="py-2.5 px-4 font-mono text-text-2">{row.us}</td>
                  <td className="py-2.5 px-4 font-mono text-accent">{row.cm} cm</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* How to measure */}
        <div className="space-y-3">
          <h4 className="text-small font-display font-medium text-text uppercase tracking-wider text-[11px] font-mono">
            How to measure your feet accurately
          </h4>
          <ol className="space-y-2 text-small text-text-2">
            <li className="flex items-start gap-2">
              <span className="font-mono text-text-3 text-[11px] mt-0.5">01.</span>
              <span>Place a sheet of paper against a flat wall on a hard floor.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-mono text-text-3 text-[11px] mt-0.5">02.</span>
              <span>Stand with your heel resting gently against the wall and mark your longest toe with a pencil.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-mono text-text-3 text-[11px] mt-0.5">03.</span>
              <span>Measure the distance in centimeters from the wall to your pencil mark and look up your UK size above.</span>
            </li>
          </ol>
        </div>

        {/* Free Exchange Protection */}
        <div className="p-3 rounded-panel border border-ok/20 bg-ok/5 flex items-center gap-2.5 text-[12px] text-ok">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>If the pair feels slightly tight or loose upon delivery, doorstep size exchange is 100% free!</span>
        </div>
      </div>
    </Sheet>
  );
};
