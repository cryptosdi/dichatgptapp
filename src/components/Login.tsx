import { useDisclosure } from '@mantine/hooks';
import { Modal, Group, Button } from '@mantine/core';
import { cloneElement, ReactElement } from "react";

export function LoginModal({ children }: { children: ReactElement }) {
    const [opened, { open, close }] = useDisclosure(false);

    return (
        <>
            {cloneElement(children, { onClick: open })}
            <Modal opened={opened} onClose={close} title="Authentication" centered>
                {/* Modal content */}
            </Modal>
        </>
    );
}