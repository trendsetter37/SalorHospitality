xml.instruct! :xml, :version=>"1.0"
xml.menucard{
  xml.special(@special)
  xml.date(@date)
  xml.title(@title)
  1.upto(3) do |category_id|
    xml << " <category#{category_id}>\n"
      for dish in Category.find(category_id).articles_in_blackboard
        use_formatted_name = !(dish.format_name.nil? or dish.format_name.empty?)
        xml.dish do
          xml << "  <name><![CDATA[#{html_escape_umlauts (use_formatted_name == true ?                        dish.format_name : "\n#{dish.name}") }]]></name>\n"
          xml << "  <price>#{'%.2f' % dish.price}</price>\n"
#          xml << "  <division>#{dish.format_division}</division>\n"
        end
      end
    xml << " </category#{category_id}>\n"
  end
}