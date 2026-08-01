// A reusable popup overlay. Pass `onClose` to close it.
export default function Modal({ title, onClose, children }) {
  return (
    // Dark background behind the modal
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black text-2xl leading-none">&times;</button>
        </div>
        {children}
      </div>
    </div>
  )
}
