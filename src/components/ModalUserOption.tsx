'use client'
import React from 'react'
import { Button, chakra, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@chakra-ui/react"
import { ReactJSXElement } from 'node_modules/@emotion/react/types/jsx-namespace'

interface ModalUserOptionProps {
    title: string,
    description: string,
    children: ReactJSXElement,
    isOpen: boolean,
    onClose: () => void,
}

function ModalUserOption({ description, isOpen, onClose, children, title }: ModalUserOptionProps) {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{title}</ModalHeader>
                <ModalCloseButton />

                <ModalBody>
                    <chakra.p>{description}</chakra.p>
                    {children}
                </ModalBody>
                <ModalFooter>
                    <Button onClick={onClose}>Go Back</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default ModalUserOption