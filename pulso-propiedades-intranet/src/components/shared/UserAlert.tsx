import Alert from '@/components/ui/Alert'

const UserAlert = ({ incompleteFields }) => (
  <Alert
    showIcon
    closable
    type="info"
    title="Información incompleta"
    className="px-6"
  >
    {`Por favor, completa con tu información los siguientes campos: ${incompleteFields.join(
      ', '
    )}`}
  </Alert>
)

export default UserAlert
