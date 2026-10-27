# ATS web user manual: Hardware support Q&A (Zebra printer)

Part of the CR12 web user manual (21 Sep 2026); index and source: README.md.

## Hardware Support Q&A

- In summary, these are the mandatory steps for printer set up:
- Connecting the printer to the laptop with the drivers installed
- Load RFID Tag Labels
- Load RFID Ribbon
- Print a test label
- Calibrate ribbon and media sensors
- Retest the label to confirm
- Some common issues encountered and recommended resolutions are:
- If printing issues are observed such as:
- Skipped labels
- Vertical image/label drift
- Ribbon out or media out errors
- VOID issues
- Faded Prints
- Perform the Steps in A and B to ensure Media and Ribbon are properly loaded. Next, perform Steps in C and D to ensure the sensor settings are still intact.

### Inserting the Media into the Printer

- Raise the media door. [image]
Figure 209 - Open media doorFigure 209 - Open media door [image]
- Remove and discard any tags or labels that are torn or dirty or that are held by adhesives or tape.
Figure 210 - Unwanted parts of the tagFigure 210 - Unwanted parts of the tag [image]
- Figure 211 - Media supply guideFigure 211 - Media supply guidePull out the media supply guide as far as it goes. [image]
[image]
- Insert roll media into the printer.
Figure 212 - Tag positionFigure 212 - Tag position [image]

| Type of media | Instructions |
|---|---|
| Roll media | Place the roll of media on the media supply hanger. Push the roll as far back as it will go. |

- Open the printhead assembly by rotating the printhead-open lever upward. Can adjust both left and right printheads for optimum ink transfer for your unit. [image]
Figure 213 - Printhead open leverFigure 213 - Printhead open lever [image]
- Figure 214 - Media guide sliderFigure 214 - Media guide sliderSlide the media guide all the way out. [image]
- CAUTION: HOT SURFACE: The printhead may be hot and could cause severe burns. Allow the printhead to cool. [image]
- From the media hanger (1), feed the media under the dancer assembly (2), through the media sensor (3), and under the printhead assembly (4). Slide the media back until it touches the inside back wall of the media sensor.
Figure 215 - Positioning of tags through the printerFigure 215 - Positioning of tags through the printer [image]
4 3 2 1
- Figure 216 - Media guide sliderFigure 216 - Media guide sliderSlide in the media guide until it just touches the edge of the media. [image]
- Ensure Ribbon is loaded and rotate the printhead-open lever downward until it locks the printhead in place. [image]
Figure 217 - Printhead open leverFigure 217 - Printhead open lever [image]
- Figure 218 - Close media doorFigure 218 - Close media doorClose the media door. [image]

### Loading the Ribbon

- Raise the media door. [image]
- Figure 219 - Open media doorFigure 219 - Open media door [image]
- CAUTION: HOT SURFACE: The printhead may be hot and can cause severe burns. Allow the printhead to cool. [image]
- Open the printhead assembly by rotating the printhead-open lever upward. [image]
Figure 220 - Printhead open leverFigure 220 - Printhead open lever [image]
- Place the roll of ribbon on the ribbon supply spindle with the loose end of the ribbon unrolling as shown. Push the roll back all the way in so that the printer can detect the presence of the roll of ribbon.
Figure 221 - Ribbon positionFigure 221 - Ribbon position [image]
- Bring the ribbon under the printhead assembly and around its left side, as shown.
Figure 222 - Position of ribbon through printerFigure 222 - Position of ribbon through printer [image]
- Wrap the ribbon tracking as far back as it can under the printhead assembly. Wrap the ribbon around the ribbon take-up spindle. Rotate the spindle several turns in the direction shown to tighten and align the ribbon.
Figure 223 - Wrap ribbon around spindleFigure 223 - Wrap ribbon around spindle [image]
- Rotate the printhead-open lever downward until it locks the printhead in place. We should hear one click if the print head is closed completely.
[image]
Figure 224 - Close printhead open lever
- Close the media door.
[image]
Figure 225 - Close media door

### Calibrating the Ribbon and Media Sensors

- Printer calibration adjusts the sensitivity of the media and ribbon sensors. It also helps ensure proper alignment of the image being printed and optimise print quality.
- Perform calibration in the following situations:
- when switched to a different size or type of ribbon or media.
- The printer experiences any of the following issues:
- skips labels
- the printed image wanders/drifts either side to side or up and down
- ribbon is not being detected when it is installed or when it runs out
- non-continuous labels are being treated as continuous
- Performing Auto Calibration:
- YSet the printer to perform an auto calibration (CALIBRATE) or a short calibration (SHORT CAL) using the POWER UP ACTION or HEAD CLOSE ACTION parameters.
- CALIBRATE—Adjusts sensor levels and thresholds, determines the label length, and feeds the media to the next web.
- SHORT CAL—Sets the media and web thresholds without adjusting sensor gain, determines the label length, and feeds the media to the next web.
- Performing Manual Sensor Calibration:
- To manually calibrate the printer if there are issues with the print output.
- Figure 226 -Printer Calibration Figure 226 -Printer Calibration Touch Print > Sensors > Manual Calibration. [image]
- Touch Start Calibration.
- Follow the steps in the calibration procedure as prompted.
- IMPORTANT: Follow the calibration procedure exactly as presented. Press and Hold
- CANCEL at any step in the procedure to cancel the calibration process.
- When calibration is complete, press PAUSE to exit pause mode and enable printing.
- Ensure that country code is updated by going to Menu > RFID > RFID> RFID Country Code > Select Singapore.
- Performing Calibration of Left and Right Printhead:
- For optimum ink transfer, it is advised to set the Left printhead to Gear 2 while Right printhead to remain as Gear 1 as shown below.
[image]
Figure 227 – Optimum Printhead Calibration

### Adjusting the Sensor Position

- The transmissive media sensor assembly consists of two parts:
- Light source (lower part of the media sensor)
- Light sensor (upper part of the media sensor) The media passes between these two parts.
- Adjust the position of the sensor only if the printer cannot detect the top of the labels. If that occurs, the printer display will showa "media out error" despite media being loaded.
- For non-continuous media with a notch or hole, the sensor must be positioned directly at the notch or hole.
- Remove the ribbon so you can see the media path clearly.
- Load the media so that the green light from the media sensor is shining through a gap, notch, or hole.
Figure 228 - Green light media sensorFigure 228 - Green light media sensor [image]
- If necessary, slide the media sensor horizontally using the media sensor adjustment.
Figure 229 - Media sensor sliderFigure 229 - Media sensor slider [image]
