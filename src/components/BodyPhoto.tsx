import { IImageProps, Image } from 'native-base'

type ImageProps = IImageProps & {
  size: number
}

export default function BodyPhoto({ size, ...rest }: ImageProps) {
  return (
    // eslint-disable-next-line jsx-a11y/alt-text
    <Image
      w={size}
      h={size}
      rounded="md"
      borderWidth={2}
      borderColor="gray.400"
      {...rest}
    />
  )
}
