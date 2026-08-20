import { WinBody, WinStatusbar, StatusPanel } from '../ui/Window'

export default function ResumeViewer() {
  return (
    <>
      <WinBody style={{ padding: 0, display: 'flex', flexDirection: 'column' }}>
        <iframe
          src="/Shreenidhi_M_Resume.pdf"
          title="Shreenidhi M Resume"
          style={{ flex: 1, border: 'none', minHeight: 480, width: '100%', background: '#fff' }}
        />
      </WinBody>
      <WinStatusbar>
        <StatusPanel>PDF Viewer</StatusPanel>
        <StatusPanel>Shreenidhi_M_Resume.pdf</StatusPanel>
      </WinStatusbar>
    </>
  )
}