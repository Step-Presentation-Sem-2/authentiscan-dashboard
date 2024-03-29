import { useNavigate } from '@remix-run/react';
import * as antIcons from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd';
import {
  message,
  Upload,
  Row,
  Col,
  GetProp,
  Form,
  Radio,
  Checkbox,
  Slider,
} from 'antd';
import { WithNavigation } from '~/components/WithNavigation';
import { useState } from 'react';

const { InboxOutlined, LoadingOutlined, PlusOutlined } = antIcons;

const { Dragger } = Upload;

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const props: UploadProps = {
  name: 'file',
  multiple: true,
  action:
    'https://corsproxy.io/?https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188',
  onChange(info) {
    console.log(info);

    const { status } = info.file;
    if (status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
  onDrop(e) {
    console.log('Dropped files', e.dataTransfer.files);
  },
};

export default function Scan() {
  const [previewImage, setPreviewImage] = useState('');
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handlePreview = async (file: UploadFile) => {
    console.log('handlePreview', file);
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }

    setPreviewImage(file.url || (file.preview as string));
  };

  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type='button'>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  return (
    <WithNavigation>
      <Form form={form}>
        {previewImage ? (
          <Form.Item>
            <Dragger {...props} onPreview={handlePreview}>
              <p className='ant-upload-drag-icon'>
                <InboxOutlined />
              </p>
              <p className='ant-upload-text'>
                Click or drag file to this area to upload
              </p>
              <p className='ant-upload-hint'>
                Support for a single or bulk upload. Upload image files.
              </p>
            </Dragger>
          </Form.Item>
        ) : (
          <>
            <Form.Item label='Model' name='model'>
              <Radio.Group value='resnet-50'>
                <Radio.Button value='resnet-50'>Resnet 50</Radio.Button>
                <Radio.Button value='resnet-101'>Resnet 101</Radio.Button>
                <Radio.Button value='resnet-152'>Resnet 152</Radio.Button>
                <Radio.Button value='vgg-16'>VGG 16</Radio.Button>
                <Radio.Button value='vgg-19'>VGG 19</Radio.Button>
              </Radio.Group>
            </Form.Item>

            <Form.Item label='Activation function' name='activation-function'>
              <Radio.Group value='resnet-50'>
                <Radio.Button value='relu'>Relu</Radio.Button>
                <Radio.Button value='softmax'>Soft-max</Radio.Button>
                <Radio.Button value='sigmoid'>Sigmoid</Radio.Button>
                <Radio.Button value='tanh'>Tanh</Radio.Button>
              </Radio.Group>
            </Form.Item>

            <Form.Item label='Help improve model'>
              <Checkbox>Allow image to be used for training</Checkbox>
            </Form.Item>
          </>
        )}
      </Form>
    </WithNavigation>
  );
}
