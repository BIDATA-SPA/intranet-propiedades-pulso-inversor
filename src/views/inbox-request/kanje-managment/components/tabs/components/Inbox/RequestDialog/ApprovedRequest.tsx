import Dialog from '@/components/ui/Dialog'
import ContractForm from '../ContractForm'

const MainContent = ({
  currentEmail = {},
  onClose,
  isContractSigned,
  setIsContractSigned,
  ownerAmount,
  setOwnerAmount,
  applicantAmount,
  setApplicantAmount,
  isShareable,
  setIsShareable,
}) => {
  return (
    <ContractForm
      currentEmail={currentEmail}
      isContractSigned={isContractSigned}
      setIsContractSigned={setIsContractSigned}
      ownerAmount={ownerAmount}
      setOwnerAmount={setOwnerAmount}
      applicantAmount={applicantAmount}
      setApplicantAmount={setApplicantAmount}
      isShareable={isShareable}
      setIsShareable={setIsShareable}
      onClose={onClose}
    />
  )
}

const ApprovedRequest = ({
  currentEmail,
  isOpen,
  onClose,
  isContractSigned,
  setIsContractSigned,
  ownerAmount,
  setOwnerAmount,
  applicantAmount,
  setApplicantAmount,
  isShareable,
  setIsShareable,
}) => {
  return (
    <Dialog
      isOpen={isOpen}
      width={800}
      height={560}
      onClose={onClose}
      onRequestClose={onClose}
    >
      <div className="flex flex-col w-full relative h-[520px] overflow-y-scroll">
        <MainContent
          currentEmail={currentEmail}
          isContractSigned={isContractSigned}
          setIsContractSigned={setIsContractSigned}
          ownerAmount={ownerAmount}
          setOwnerAmount={setOwnerAmount}
          applicantAmount={applicantAmount}
          setApplicantAmount={setApplicantAmount}
          isShareable={isShareable}
          setIsShareable={setIsShareable}
          onClose={onClose}
        />
      </div>
    </Dialog>
  )
}

export default ApprovedRequest
