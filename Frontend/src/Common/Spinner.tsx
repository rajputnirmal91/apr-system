import { ClipLoader } from 'react-spinners'

interface SpinnerProps {
  loading?: boolean
  size?: number
  color?: string
  overlay?: boolean
}

function Spinner({
  loading = true,
  size = 50,
  color = '#36d7b7',
  overlay = true,
}: SpinnerProps) {
  if (!loading) return null

  return (
    <div
      style={{
        position: overlay ? 'fixed' : 'relative',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: overlay ? 'rgba(255, 255, 255, 0.7)' : 'transparent',
        zIndex: 9999,
      }}
    >
      <ClipLoader color={color} loading={loading} size={size} />
    </div>
  )
}

export default Spinner
