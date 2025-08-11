'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Form, useForm } from 'react-hook-form'
import { useLocale, useTranslations } from 'next-intl'
import { toast } from 'sonner'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Crown, User, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { LanguageSelector } from '@/components/language-selector'
import LightDarkModeBtn from '@/components/light-dark-mode-btn'
import { LoginBody, LoginBodyType } from '@/lib/schemaValidations/auth.schema'
import { zodResolver } from "@hookform/resolvers/zod"

type EmployeeFormValues = { username: string; password: string }

async function loginViaNext(body: Record<string, string>) {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    // Ưu tiên thông điệp lỗi từ server nếu có
    const msg =
      data?.message ||
      data?.error ||
      data?.errors?.[0]?.message ||
      'Login failed'
    throw new Error(msg)
  }
  return data
}

export const LoginForm = () => {
  const t = useTranslations()
  const router = useRouter()
  const locale = useLocale();

  const [tab, setTab] = useState<'admin' | 'employee'>('admin')

  const {
    register: registerAdmin,
    handleSubmit: handleSubmitAdmin,
    formState: { errors: adminErrors },
  } = useForm<LoginBodyType>({
    resolver: zodResolver(LoginBody),
    defaultValues: {
      email: 'linhnguyenphuong59@gmail.com',
      password: 'Pass@123',
    },
  })

  const {
    register: registerEmployee,
    handleSubmit: handleSubmitEmployee,
    formState: { errors: employeeErrors },
  } = useForm<EmployeeFormValues>({
    defaultValues: {
      username: 'employeeStore1',
      password: 'Pass@123',
    },
  })

  const [adminLoading, setAdminLoading] = useState(false)
  const [employeeLoading, setEmployeeLoading] = useState(false)
  const [adminError, setAdminError] = useState<string | null>(null)
  const [employeeError, setEmployeeError] = useState<string | null>(null)

  const onSubmitAdmin = handleSubmitAdmin(async (values) => {
    setAdminError(null)
    setAdminLoading(true)
    try {
      await loginViaNext(values) // { email, password }
      toast.success('Logged in')
      router.push(`/${locale}/tables`);
      router.refresh()
    } catch (err: any) {
      setAdminError(err?.message || 'Login error')
    } finally {
      setAdminLoading(false)
    }
  })

  const onSubmitEmployee = handleSubmitEmployee(async (values) => {
    setEmployeeError(null)
    setEmployeeLoading(true)
    try {
      await loginViaNext(values) // { username, password }
      toast.success('Logged in')
      router.push('/')
      router.refresh()
    } catch (err: any) {
      setEmployeeError(err?.message || 'Login error')
    } finally {
      setEmployeeLoading(false)
    }
  })

  return (
    <Card className="glass shadow-luxury border-border/50">
      <CardHeader className="space-y-1 pb-4">
        <CardTitle className="text-2xl font-luxury text-center">
          {t('login.welcomeBack')}
        </CardTitle>
        <CardDescription className="text-center">
          {t('login.description2')}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs value={tab} onValueChange={(v) => setTab(v as any)} className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="admin" className="flex items-center gap-2">
              <Crown className="h-4 w-4" />
              {t('login.admin')}
            </TabsTrigger>
            <TabsTrigger value="employee" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              {t('login.employee')}
            </TabsTrigger>
          </TabsList>

          {/* ADMIN TAB */}
          <TabsContent value="admin" className="space-y-4">
            {adminError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{adminError}</AlertDescription>
              </Alert>
            )}

            <form className="space-y-4" onSubmit={onSubmitAdmin} noValidate> 
                <div className="space-y-2">
                  <Label htmlFor="admin-email">{t('login.eamilAddress')}</Label>
                  <Input
                    id="admin-email"
                    type="email"
                    {...registerAdmin('email', { required: t('common.required') as string })}
                  />
                  {adminErrors.email && (
                    <p className="text-xs text-destructive">
                      {adminErrors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="admin-password">{t('login.password')}</Label>
                  <Input
                    id="admin-password"
                    type="password"
                    {...registerAdmin('password', { required: t('common.required') as string })}
                  />
                  {adminErrors.password && (
                    <p className="text-xs text-destructive">
                      {adminErrors.password.message}
                    </p>
                  )}
                </div>

                <Button className="w-full btn-luxury" type="submit" disabled={adminLoading}>
                  {adminLoading ? t('login.signingIn') : t('login.signIn')}
                </Button>
              </form>
          </TabsContent>

          {/* EMPLOYEE TAB */}
          <TabsContent value="employee" className="space-y-4">
            {employeeError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{employeeError}</AlertDescription>
              </Alert>
            )}

            <form className="space-y-4" onSubmit={onSubmitEmployee} noValidate>
              <div className="space-y-2">
                <Label htmlFor="employee-username">{t('login.username')}</Label>
                <Input
                  id="employee-username"
                  type="text"
                  {...registerEmployee('username', { required: t('common.required') as string })}
                />
                {employeeErrors.username && (
                  <p className="text-xs text-destructive">
                    {employeeErrors.username.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="employee-password">{t('login.password')}</Label>
                <Input
                  id="employee-password"
                  type="password"
                  {...registerEmployee('password', { required: t('common.required') as string })}
                />
                {employeeErrors.password && (
                  <p className="text-xs text-destructive">
                    {employeeErrors.password.message}
                  </p>
                )}
              </div>

              <Button className="w-full btn-luxury" type="submit" disabled={employeeLoading}>
                {employeeLoading ? t('login.signingIn') : t('login.signInAsEmployee')}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <div className="text-center mt-3">
          <LanguageSelector />
          <LightDarkModeBtn />
        </div>

        {/* Demo Credentials */}
        <div className="mt-6 p-4 bg-muted/30 rounded-lg text-xs space-y-2">
          <p className="font-medium text-muted-foreground">Demo Credentials:</p>
          <div className="space-y-1">
            <p><strong>Admin:</strong> linhnguyenphuong59@gmail.com / Pass@123</p>
            <p><strong>Employee Store 1:</strong> employeeStore1 / Pass@123</p>
            <p><strong>Employee Store 2:</strong> employeeStore2 / Pass@123</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
