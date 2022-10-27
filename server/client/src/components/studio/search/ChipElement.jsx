import { Chip } from '@mui/material'

const ChipElement = ({chip, index, handleDelete}) => {
  return (
    <Chip
      color='primary'
      label={chip === "?" ? "Contains Questions" : chip}
      onDelete={() => handleDelete(index) }
    />
  )
}

export default ChipElement