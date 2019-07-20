import tensorflow as tf

with tf.Session(graph=tf.Graph()) as sess:
  tf.saved_model.loader.load(sess, [tag_constants.TRAINING], './fromScratch.json')

print(tf)