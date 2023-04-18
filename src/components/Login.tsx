import { useDisclosure } from '@mantine/hooks';
import {
    Modal, TextInput,
    PasswordInput,
    Group,
    Button,
    Paper,
    Text,
    LoadingOverlay,
    Anchor, useMantineTheme,
} from '@mantine/core';
import { cloneElement, ReactElement } from "react";
import { useForm } from '@mantine/form';
import { IconLock } from '@tabler/icons-react';
import { useState } from 'react';
import axios from 'axios'
import { useCookies } from 'react-cookie';
import jwt_decode from 'jwt-decode';
import jwt from 'jsonwebtoken';

export function LoginModal({ children }: { children: ReactElement }) {
    const [opened, { open, close }] = useDisclosure(false);
    const [formType, setFormType] = useState<'register' | 'login'>('register');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>("");
    const theme = useMantineTheme();
    const toggleFormType = () => {
        setFormType((current) => (current === 'register' ? 'login' : 'register'));
        setError("");
    };
    const form = useForm({
        initialValues: {
            name: '',
            password: '',
            confirmPassword: '',
        },
    });

    type FormValues = typeof form.values;

    const handleSubmit = (values: FormValues) => {
        setLoading(true);
        formType === 'register' ?
            axios.post('http://127.0.0.1:5000/login/reg', {
                un: values.name,
                pw: values.password,
            })
                .then(response => {
                    console.log(response.data.data.access_token);
                    localStorage.setItem('access_token', response.data.data.access_token)
                    setLoading(false);
                    close();
                })
                .catch(error => {
                    setLoading(false);
                    if (error.response) {
                        console.error(error.response.data);
                        console.error(error.response.status);
                        setError(error.response.data.message)
                    } else {
                        console.error(error.message);
                    }
                })
            : axios.post('http://127.0.0.1:5000/login', {
                un: values.name,
                pw: values.password,
            })
                .then(response => {
                    console.log(response.data.data.access_token);
                    localStorage.setItem('access_token', response.data.data.access_token)
                    setLoading(false);
                    close();
                })
                .catch(error => {
                    setLoading(false);
                    if (error.response) {
                        console.error(error.response.data);
                        console.error(error.response.status);
                        setError(error.response.data.message)
                    } else {
                        console.error(error.message);
                    }
                })
    };


    return (
        <>
            {cloneElement(children, { onClick: open })}
            <Modal opened={opened} onClose={close} title="Login" centered>
                <Paper
                    p={0}
                    shadow={'sm'}

                    sx={{
                        position: 'relative',
                        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
                    }}
                >
                    <form onSubmit={form.onSubmit(handleSubmit)}>
                        <LoadingOverlay visible={loading} />
                        <TextInput
                            data-autofocus
                            required
                            placeholder="Your name"
                            label="name"
                            {...form.getInputProps('name')}
                        />
                        <PasswordInput
                            mt="md"
                            required
                            placeholder="Password"
                            label="Password"
                            icon={<IconLock size={16} stroke={1.5} />}
                            {...form.getInputProps('password')}
                        />

                        {formType === 'register' && (
                            <PasswordInput
                                mt="md"
                                required
                                label="Confirm Password"
                                placeholder="Confirm password"
                                icon={<IconLock size={16} stroke={1.5} />}
                                {...form.getInputProps('confirmPassword')}
                            />
                        )}


                        {error && (
                            <Text color="red" size="sm" mt="sm">
                                {error}
                            </Text>
                        )}

                        {(
                            <Group position="apart" mt="xl">
                                <Anchor
                                    component="button"
                                    type="button"
                                    color="dimmed"
                                    onClick={toggleFormType}
                                    size="sm"
                                >
                                    {formType === 'register'
                                        ? 'Have an account? Login'
                                        : "Don't have an account? Register"}
                                </Anchor>

                                <Button color="blue" type="submit">
                                    {formType === 'register' ? 'Register' : 'Login'}
                                </Button>
                            </Group>
                        )}
                    </form>
                </Paper>
            </Modal>
        </>
    );
}