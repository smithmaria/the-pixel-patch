import './Button.css'

const colorMap = {
  orange: 'var(--orange)',
  greenLight: 'var(--green-light)'
}

const Button = ({ 
  text, 
  onClick, 
  padding = '.8rem 1rem',
  color = 'orange', 
  fontSize = '1rem'
}) => {
  return (
    <div 
      onClick={onClick}
      className='button'
      style={{ 
        padding: padding,
        backgroundColor: colorMap[color],
        fontSize: fontSize
      }}
    >
      {text}
    </div>
  )
}

export default Button;
