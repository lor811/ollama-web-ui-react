import { Alert, Spinner} from '@chakra-ui/react'
import FallbackLayout from './FallbackLayout'

const LoadingFallback = () => {

  return (
    <FallbackLayout>
      <Alert.Root size={"lg"}
      borderStartWidth={"3px"}
      borderStartColor={"colorPalette.600"}
      title={"Loading..."}
      >
      <Alert.Indicator>
        <Spinner size={"md"} />
      </Alert.Indicator>
      <Alert.Title fontSize={"lg"}>Loading...</Alert.Title>
    </Alert.Root>
    </FallbackLayout>
  )
}

export default LoadingFallback