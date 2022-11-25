import Chip from "@mui/material/Chip";
import "./chip.css";
import { useSelector } from 'react-redux';

const ChipElement = ({tag, handleClick, chipText}) => {
	const { theme } = useSelector((state) => state.user);

  return (
  <>
    {chipText === tag ? (
      <Chip
        onClick={handleClick}
        className="chip"
        label={tag[0].toUpperCase() + tag.slice(1)}
        sx={{
          color: theme.chip,
          background: theme.text,
          border: "1px solid" + theme.soft,
        }}
        clickable={true}
      />
    ) : (
      <Chip
        onClick={handleClick}
        className="chip"
        data-name={tag}
        label={tag[0].toUpperCase() + tag.slice(1)}
        sx={{
          color: theme.text,
          background: theme.chip,
          border: "1px solid" + theme.soft,
        }}
        clickable={true}
      />
    )}
  </>   
  )
}

export default ChipElement