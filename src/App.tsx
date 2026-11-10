import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './AppRoutes'
import { ROUTER_BASENAME } from './utils/constants'

function App() {
  return (
    <BrowserRouter basename={ROUTER_BASENAME}>
      <AppRoutes />
    </BrowserRouter>
  )
}

export default App
