import { Drawer } from 'vaul';

interface SimpleDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SimpleDrawer({ isOpen, onClose }: SimpleDrawerProps) {
  console.log('SimpleDrawer render:', isOpen);

  return (
    <Drawer.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
        <Drawer.Content className="bg-white flex flex-col rounded-t-[10px] h-[50%] fixed bottom-0 left-0 right-0">
          <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-gray-300 mb-8 mt-4" />
          <div className="p-4">
            <Drawer.Title className="text-xl font-bold mb-4">
              Simple Test Drawer
            </Drawer.Title>
            <p>This is a simple test to verify Vaul is working.</p>
            <button
              onClick={onClose}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}