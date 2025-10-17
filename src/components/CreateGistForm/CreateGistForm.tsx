import React from 'react'
import { Controller } from 'react-hook-form'
import { Button, Input, Switch, Card, Form, Space, Divider } from 'antd'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons'
import { useCreateGistForm, type CreateGistFormData } from '../../hooks/forms/useGistForms'
import { useCreateGist } from '../../hooks/queries/useGists'
import './create-gist-form.scss'

const { TextArea } = Input

interface CreateGistFormProps {
  onSuccess?: (gist: any) => void
  onCancel?: () => void
}

export const CreateGistForm: React.FC<CreateGistFormProps> = ({
  onSuccess,
  onCancel,
}) => {
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useCreateGistForm()

  const createGistMutation = useCreateGist()
  const files = watch('files')

  const onSubmit = async (data: CreateGistFormData) => {
    try {
      // Transform files array to the format expected by GitHub API
      const filesObject = data.files.reduce((acc, file) => {
        acc[file.filename] = { content: file.content }
        return acc
      }, {} as Record<string, { content: string }>)

      const gistData = {
        description: data.description,
        public: data.isPublic,
        files: filesObject,
      }

      const result = await createGistMutation.mutateAsync(gistData)
      onSuccess?.(result)
    } catch (error) {
      console.error('Failed to create gist:', error)
    }
  }

  const addFile = () => {
    setValue('files', [...files, { filename: '', content: '', language: '' }])
  }

  const removeFile = (index: number) => {
    if (files.length > 1) {
      const newFiles = files.filter((_, i) => i !== index)
      setValue('files', newFiles)
    }
  }

  return (
    <Card title="Create New Gist" className="create-gist-form">
      <Form layout="vertical">
        <Form.Item
          label="Description"
          validateStatus={errors.description ? 'error' : ''}
          help={errors.description?.message}
        >
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Brief description of your gist"
                maxLength={256}
                showCount
              />
            )}
          />
        </Form.Item>

        <Form.Item label="Visibility">
          <Controller
            name="isPublic"
            control={control}
            render={({ field }) => (
              <Switch
                checked={field.value}
                onChange={field.onChange}
                checkedChildren="Public"
                unCheckedChildren="Secret"
              />
            )}
          />
        </Form.Item>

        <Divider>Files</Divider>

        {files.map((_, index) => (
          <Card
            key={index}
            size="small"
            className="file-card"
            title={`File ${index + 1}`}
            extra={
              files.length > 1 && (
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => removeFile(index)}
                  size="small"
                >
                  Remove
                </Button>
              )
            }
          >
            <Form.Item
              label="Filename"
              validateStatus={errors.files?.[index]?.filename ? 'error' : ''}
              help={errors.files?.[index]?.filename?.message}
            >
              <Controller
                name={`files.${index}.filename`}
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="e.g., example.js, README.md"
                  />
                )}
              />
            </Form.Item>

            <Form.Item
              label="Content"
              validateStatus={errors.files?.[index]?.content ? 'error' : ''}
              help={errors.files?.[index]?.content?.message}
            >
              <Controller
                name={`files.${index}.content`}
                control={control}
                render={({ field }) => (
                  <TextArea
                    {...field}
                    placeholder="Enter your code or text here..."
                    rows={10}
                    className="code-textarea"
                  />
                )}
              />
            </Form.Item>
          </Card>
        ))}

        <Button
          type="dashed"
          onClick={addFile}
          icon={<PlusOutlined />}
          className="add-file-btn"
          block
        >
          Add Another File
        </Button>

        <Divider />

        <Space className="form-actions">
          {onCancel && (
            <Button onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button
            type="primary"
            onClick={handleSubmit(onSubmit)}
            loading={createGistMutation.isPending}
            disabled={!isValid}
          >
            Create Gist
          </Button>
        </Space>
      </Form>
    </Card>
  )
}